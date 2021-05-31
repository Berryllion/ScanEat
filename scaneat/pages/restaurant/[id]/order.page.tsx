import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';

import { ReduxState } from "../../../logic";
import { getOrderByToken, sendOrder } from "../../../logic/api/order";
import { Dish, Order, OrderStatus } from "../../../logic/types";
import Page, { widthLimit } from "../../../components/Page";
import { cardShadow, green, lightGreen } from "../../../components/colors";
import { bpdw, BreakpointSizes } from "../../../components/breakpoints";
import { getRestaurant } from "../../../logic/api/restaurant";
import { SET_RESTAURANT } from "../../../logic/actions/restaurant";
import { ChevronLeft } from "react-feather";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${widthLimit};
  margin: auto;
  box-sizing: border-box;
  padding: 2rem;
`;
const Title = styled.div`
  height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  h1 {
    font-family: 'Fredoka One';
    font-weight: 100;
    font-size: 3rem;
    margin: 0;
  }
  p {
    font-family: 'Segoe UI Bold';
    font-size: 1.5rem;
    margin: 0;
  }
`;
const Content = styled.div`
  margin-top: 5rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  ${bpdw(BreakpointSizes.md)} {
    flex-direction: column-reverse;
    align-items: center;
  }
`;
const DishesList = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;

  h2 {
    font-family: 'Segoe UI Bold';
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  ${bpdw(BreakpointSizes.md)} {
    width: 100%;
  }
`;
const DishItem = styled.div`
  position: relative;
  border: 1px solid white;
  border-top: 1px solid #e4e4e4;
  padding: 1.5rem 1rem;
  transition: 250ms;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;

  &:hover {
    border: 1px solid #c4c4c4;
    border-right: 1px solid white;
    border-radius: 0.5rem;
  }
  &:after {
    content: "";
    transition: .5s;
    border: 2px solid ${green};
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
  }
`;
const DishItemName = styled.p`
  margin: 0;
  margin-bottom: .25rem;
  font-size: 1.1rem;
  font-family: 'Segoe UI Bold';
`;
const DishItemPrice = styled.p`
  margin: 0;
  margin-top: 0.5rem;
  font-weight: normal;
  font-size: 1rem;
  font-family: 'Segoe UI';
`;
const AddMoreButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 1rem;
  border-top: 1px solid #e4e4e4;
  padding: 1.5rem 1rem;

  cursor: pointer;

  &:hover {
    p {
      color: ${green};
    }
    svg {
      color: ${green};
    }
  }

  svg {
    transition: 100ms;
  }
  p {
    margin: 0;
    transition: 100ms;
    font-size: 1.25rem;
    line-height: 1rem;
    font-weight: normal;
    font-family: 'Segoe UI';
  }
`;
const OrderCard = styled.div`
  position: sticky;
  top: 4rem;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  box-shadow: ${cardShadow};
  gap: 2rem;
  width: 30%;
  box-sizing: border-box;
  z-index: 100;
  background-color: white;

  h1 {
    font-family: 'Segoe UI Bold';
    font-size: 2rem;
    margin: 0;
  }
  h4 {
    text-align: center;
    margin: 0;
  }

  ${bpdw(BreakpointSizes.md)} {
    top: 0.5rem;
    margin-bottom: 2rem;
    width: 100%;
  }
`;
const PriceContainer = styled.div`  
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  p {
    margin: 0;
    font-family: 'Segoe UI';
    font-weight: normal;
  }
  h2 {
    margin: 0;
    font-family: 'Segoe UI Bold';
  }
`;
const ConfirmButton = styled.button`
  cursor: pointer;
  border-radius: 0.5rem;
  background-color: ${green};
  color: white;
  font-family: 'Segoe UI';
  font-size: 1.5rem;
  padding: 0.5rem;

  transition: .25s;
  &:hover {
    background-color: ${lightGreen};
  }
`;

const Index = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const restaurant = useSelector((state: ReduxState) => state.watchingRestaurant);
  const table = useSelector((state: ReduxState) => state.table);
  const [orderDishes, setOrderDishes] = useState<Array<Dish>>([]);
  const [order, setOrder] = useState<Order>();
  const id = router.query.id as string;

  const goBack = async () => {
    router.replace(`/restaurant/${id}`);
  }

  const loadRestaurant = async () => {
    const {success, data} = await getRestaurant(dispatch, ws, id);
    if (success) {
      dispatch({
        type: SET_RESTAURANT,
        payload: data,
      })
    }
  };
  const loadBasket = () => {
    const basket = localStorage.getItem('basket');
    if (basket === null)
      return goBack();
    const data = JSON.parse(basket);
    const restaurantId = data.restaurantId;
    const _orderDishes = data.orderDishes;
    if (restaurantId != id || _orderDishes.length === 0)
      return goBack();
    setOrderDishes(_orderDishes);
  };
  const loadOrder = async () => {
    const orderToken = localStorage.getItem('currentOrder');
    if (orderToken === null)
      return;
    const {success, data} = await getOrderByToken(dispatch, ws, orderToken);
    if (success) {
      const _order: Order = data;
      if (_order.status !== OrderStatus.WAITING && _order.status !== OrderStatus.CONFIRMED && _order.status !== OrderStatus.REFUSED)
        goBack();
      if (_order.status === OrderStatus.REFUSED) {
        localStorage.removeItem('basket');
        localStorage.removeItem('currentOrder');
      }
      setOrder(_order);
    } else if (data === "Unauthorized") {
      localStorage.removeItem('currentOrder');
    }
  }
  const confirm = async () => {
    console.log(restaurant, table);
    if (restaurant && table) {
      const { success, data } = await sendOrder(dispatch, ws, { restaurant, orderDishes, table });
      if (success) {
        setOrder(data);
        localStorage.setItem('currentOrder', data.orderToken);
      }
    }
  }

  useEffect(() => {
    if (id) {
      loadBasket();
      loadOrder();  
    }
    const interval = setInterval(() => {
      loadOrder();
    }, 5000);
    if (id && (!restaurant || restaurant.id.toString() !== id))
      loadRestaurant();
    return () => {
      clearInterval(interval);
    }  
  }, [id]);

  return (
    <Page>
      <Container>
        <Title>
          <h1>
            Checkout
          </h1>
          <p>
            {restaurant?.name || (<>&nbsp;</>)}
          </p>
        </Title>
        <Content>
          <DishesList>
            <h2>
              Selected items
            </h2>
            { orderDishes.map((dish, i) => (
              <DishItem key={i}>
                <DishItemName>
                  {dish.name}
                </DishItemName>
                <DishItemPrice>
                  €{dish.price.toFixed(2)}
                </DishItemPrice>
              </DishItem>
            ))}
            <Link href={`/restaurant/${id}`}>
              <AddMoreButton>
                <ChevronLeft />
                <p>
                  Go back to the menu
                </p>
              </AddMoreButton>
            </Link>
          </DishesList>
          <OrderCard>
            <h1>
              {!order ? 'Your order' :
                order.status === OrderStatus.WAITING ?
                  'Order pending' :
                order.status === OrderStatus.CONFIRMED ? 
                  'Order confirmed' :
                order.status === OrderStatus.FINISHED ?
                  'Order already paid' :
                  'Order refused'
              }
            </h1>
            <PriceContainer>
              <p>
                Total sum
              </p>
              <h2>
                {orderDishes.reduce((acc, d) => acc + d.price, 0).toFixed(2)}€
              </h2>
            </PriceContainer>
            {!order && (
              <ConfirmButton onClick={confirm}>
                Confirm order
              </ConfirmButton>
            )}
            {order && order.status === OrderStatus.CONFIRMED && (
              <Link href={`/restaurant/${id}/pay`}>
                <ConfirmButton>
                  Pay
                </ConfirmButton>
              </Link>
            )}
            {order && order.status === OrderStatus.WAITING && (
              <h4>
                Waiting for restaurant staff confirmation...
              </h4>
            )}
          </OrderCard>
        </Content>
      </Container>
    </Page>
  );
}

export default Index;