import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';

import Page from '../../../components/Page';
import { Dish } from '../../../logic/types';
import { getRestaurant } from '../../../logic/api/restaurant';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../../../logic';
import { SET_RESTAURANT, DEL_RESTAURANT } from '../../../logic/actions/restaurant';

import Hero from '../../../components/restaurantView/hero';

import { cardShadow, green, lightGreen } from '../../../components/colors';
import RestaurantPositionMap from './components/RestaurantPositionMap';
import {
  Content,
  DishList,
  CategoryContainer,
  CategoryName,
  CategoryDishList,
  CategoryDishItem,
  CategoryDishItemName,
  CategoryDishItemDescription,
  CategoryDishItemPrice,
  AddRemoveContainer,
  AddRemoveButton,
  TopOrder,
} from '../../../components/restaurantView/content';

const Container = styled.div`
  min-height: calc(90vh - 70px);
  margin-top: 10vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const OrderButton = styled.button`
  cursor: pointer;
  border-radius: 0.5rem;
  background-color: ${green};
  color: white;
  font-family: 'Segoe UI';
  font-size: 1.25rem;
  padding: 0.75rem 1.25rem;
  z-index: 1000;
  box-shadow: ${cardShadow};

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

  transition: .25s;
  &:hover {
    background-color: ${lightGreen};
  }
  p {
    margin: 0;
  }
`;

const Index = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const onSite = useSelector((state: ReduxState) => state.onSite);
  const restaurant = useSelector((state: ReduxState) => state.watchingRestaurant);
  const [orderDishes, setOrderDishes] = useState<Array<Dish>>([]);
  const id = router.query.id as string;

  const loadRestaurant = async () => {
    const {success, data} = await getRestaurant(dispatch, ws, id);
    if (success) {
      dispatch({
        type: SET_RESTAURANT,
        payload: data,
      });
    }
  };

  const handleRouteChange = (url: string) => {
    if (!url.startsWith('/restaurant/')) {
      dispatch({
        type: DEL_RESTAURANT
      })
    }
  };

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);
    const basket = localStorage.getItem('basket');
    if (basket !== null) {
      const { orderDishes } = JSON.parse(basket);
      if (orderDishes)
        setOrderDishes(orderDishes);      
    }
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    }
  }, []);

  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('basket', JSON.stringify({
        restaurantId: restaurant.id,
        orderDishes,
      }));
    }
  }, [orderDishes]);

  useEffect(() => {
    if (id && !restaurant)
      loadRestaurant();
    if (id) {
      const basket = localStorage.getItem('basket');
      if (basket !== null) {
        const { restaurantId } = JSON.parse(basket);
        if (restaurantId.toString() !== id) {
          localStorage.removeItem('basket');
          setOrderDishes([]);
        }
      }
    }
  }, [id])

  return (
    <Page transparentHeader>
      <Container>
        <Hero restaurant={restaurant} />
        <TopOrder isMap={!(orderDishes.length > 0 && onSite)}>
          {(orderDishes.length > 0 && onSite) ? (
            <Link href={router.asPath.split('?')[0] + '/order'}>
              <OrderButton>
                <p>
                  Go to checkout
                </p>
                <p>
                  €{orderDishes.reduce((acc, d) => acc + d.price, 0).toFixed(2)}
                </p>
              </OrderButton>
            </Link>
          ) : (
            <RestaurantPositionMap
              latt={restaurant?.latt || 0}
              long={restaurant?.long || 0}
            />
          )}
        </TopOrder>
        <Content>
          <DishList>
            { restaurant?.categories.map((category, i) => (
              <CategoryContainer key={i}>
                <CategoryName>
                  {category.name}
                </CategoryName>
                <CategoryDishList>
                  {category.dishes.map((dish, i2, ar) => {
                    const count = orderDishes.filter((d) => d.id === dish.id).length;
                    return (
                      <CategoryDishItem key={i2} count={count} last={i2 === ar.length - 1}>
                        <div>
                          <CategoryDishItemName>
                            {dish.name}
                          </CategoryDishItemName>
                          <CategoryDishItemDescription>
                            {dish.description}
                          </CategoryDishItemDescription>
                          <CategoryDishItemPrice>
                            €{dish.price.toFixed(2)}
                          </CategoryDishItemPrice>
                        </div>
                        <AddRemoveContainer>
                          { count > 0 && (
                            <>
                              <AddRemoveButton onClick={() => {
                                const index = orderDishes.findIndex((d) => d.id === dish.id);
                                orderDishes.splice(index, 1);
                                setOrderDishes([...orderDishes])
                              }}>
                                -
                              </AddRemoveButton>
                              x{ count }
                            </>
                          )}
                          { onSite && (
                            <AddRemoveButton onClick={() => setOrderDishes([...orderDishes, dish])}>
                              +
                            </AddRemoveButton>
                          )}
                        </AddRemoveContainer>
                      </CategoryDishItem>
                    );
                  })}
                </CategoryDishList>
              </CategoryContainer>
            ))}
          </DishList>
        </Content>
      </Container>
    </Page>
  );
};

export default Index;
