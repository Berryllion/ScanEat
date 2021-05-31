import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';

import { ReduxState } from "../../../logic";
import { getOrderByToken, payOrder } from "../../../logic/api/order";
import { Dish, Order, OrderStatus } from "../../../logic/types";
import Page, { widthLimit } from '../../../components/Page';
import { green, lightGreen, lightRed, red } from "../../../components/colors";
import { bpdw, BreakpointSizes } from "../../../components/breakpoints";
import { getRestaurant } from "../../../logic/api/restaurant";
import { SET_RESTAURANT } from "../../../logic/actions/restaurant";

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
const PaymentCard = styled.div`
  position: sticky;
  top: 4rem;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  box-shadow: 0 8px 24px 0 rgb(32 33 37 / 12%);
  width: 30%;
  gap: 1rem;
  box-sizing: border-box;

  h1 {
    font-family: 'Segoe UI Bold';
    font-size: 2rem;
    margin: 0;
    margin-bottom: 1rem;
  }
  h4 {
    text-align: center;
    margin: 0;
  }

  ${bpdw(BreakpointSizes.md)} {
    width: 100%;
    margin-top: 4rem;
  }
`;
const PriceRow = styled.div`
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
const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-top: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;

  p {
    margin: 0;
    font-family: 'Segoe UI SemiBold';
    font-weight: normal;
  }
  h2 {
    margin: 0;
    font-family: 'Segoe UI Bold';
  }
`;
const PayButton = styled.button<{redColor?: boolean}>`
  cursor: pointer;
  border-radius: 0.5rem;
  background-color: ${({redColor}) => redColor ? red : green};
  color: white;
  font-family: 'Segoe UI';
  font-size: 1.5rem;
  padding: 0.5rem;

  transition: .25s;
  &:hover {
    background-color: ${({redColor}) => redColor ? lightRed : lightGreen};
  }
`;

const Index = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const [orderDishes, setOrderDishes] = useState<Array<Dish>>([]);
  const restaurant = useSelector((state: ReduxState) => state.watchingRestaurant);
  const [_order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(false);
  const id = router.query.id as string;

  const goBack = async () => {
    router.replace(`/restaurant/${id}`);
  }
  const toFinish = async () => {
    router.replace(`/restaurant/${id}/finish`);
    localStorage.removeItem('basket');
    localStorage.removeItem('currentOrder');
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
      if (_order.status !== OrderStatus.CONFIRMED && _order.status !== OrderStatus.FINISHED)
        goBack();
      setOrder(_order);
    }
  }

  const pay = async () => {
    const orderToken = localStorage.getItem('currentOrder');
    if (orderToken === null)
      return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const {success, data} = await payOrder(dispatch, ws, orderToken);
    setLoading(false);
    if (success) {
      setOrder(data);
      toFinish();
    }
  }

  useEffect(() => {
    if (id && (!restaurant || restaurant.id.toString() !== id))
      loadRestaurant();
    if (id) {
      loadBasket();
      loadOrder();  
    }
  }, [id]);

  const totalPrice = orderDishes.reduce((acc, d) => acc + d.price, 0);

  return (
    <Page>
      <Container>
        <Title>
          <h1>
            Payment
          </h1>
          <p>
            {restaurant?.name || (<>&nbsp;</>)}
          </p>
        </Title>
        <PaymentCard>
          <h1>
            Amount:
          </h1>
          <PriceRow>
            <p>
              Items
            </p>
            <h2>
              {totalPrice.toFixed(2)}€
            </h2>
          </PriceRow>
          <PriceRow>
            <p>
              (Incl. service fee: 3%)
            </p>
            <h2>
              {(totalPrice * 3 / 100).toFixed(2)}€
            </h2>
          </PriceRow>
          <TotalRow>
            <p>
              Total
            </p>
            <h2>
              {totalPrice.toFixed(2)}€
            </h2>
          </TotalRow>
          {loading ? (
            <h4>
              Loading...
            </h4>
          ) : (
            <>
            <PayButton onClick={pay}>
              Online payment
            </PayButton>
            <PayButton onClick={toFinish} redColor>
              Pay with cash
            </PayButton>
            </>
          )}
        </PaymentCard>
      </Container>
    </Page>
  );
}

export default Index;