import { FunctionComponent, useEffect } from 'react';
import { Check, DollarSign, X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { cardShadow, green, orange, red, blue } from '../../components/colors';
import { ReduxState } from '../../logic';
import { updateOrder } from '../../logic/api/order';
import { getMyRestaurant } from '../../logic/api/restaurant';
import { OrderStatus, Order, OrderDish } from '../../logic/types';

const statusToColor = {
  [OrderStatus.WAITING]: orange,
  [OrderStatus.CONFIRMED]: blue,
  [OrderStatus.REFUSED]: red,
  [OrderStatus.FINISHED]: green,
};

const Container = styled.div`
  width: 98vw;
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;

  .order-type:nth-child(2) {
    border-left: 1px solid #CCC;
    border-right: 1px solid #CCC;
  }
`;

const OrderTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0px, 1fr));
  padding: 1rem;
  gap: 1rem;
`;

const OrderTypeName = styled.h1`
  width: 100%;
  text-align: center;
`;

const SingleOrder = styled.div<{ lineColor: string }>`
  position: relative;
  width: 100%;
  box-shadow: ${cardShadow};
  border-radius: 1rem;
  padding: 2rem 1rem 4rem 1rem;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background-color: ${({ lineColor }) => lineColor};
  }
  ul {
    margin: 0;
    padding: 0 0 0 2rem;
    li {
      list-style-type: disclosure-closed;
    }
  }
`;
const CardInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  h3 {
    margin: 0;
    font-family: "Segoe UI SemiBold";
  }
  p {
    margin: 0;
    font-family: "Segoe UI";
    text-align: right;
  }
`;
const ActionRow = styled.div<{ lineColor: string }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-around;
  background-color: ${({ lineColor }) => lineColor};
`;
const ActionButton = styled.div<{ color: string }>`
  padding: .5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  background-color: ${({ color }) => color};
  svg {
    color: white;
  }
`;

const OrderCard: FunctionComponent<{ order: Order }> = ({ order }) => {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);

  const _updateOrder = async (status: OrderStatus, paid: boolean) => {
    await updateOrder(dispatch, ws, order.id, status, paid);
  }

  return (
    <SingleOrder lineColor={statusToColor[order.status]}>
      <CardInfo>
        <h3>
          Price
        </h3>
        <p>
          {order.price}
        </p>
      </CardInfo>
      <CardInfo>
        <h3>
          Table
        </h3>
        <p>
          {order.table}
        </p>
      </CardInfo>
      <CardInfo>
        <h3>
          Time
        </h3>
        <p>
          {(new Date(order.createdAt)).toLocaleString()}
        </p>
      </CardInfo>
      <CardInfo>
        <h3>
          Paid
        </h3>
        <p>
          {order.paid ? "Yes" : "No"}
        </p>
      </CardInfo>
      <CardInfo>
        <h3>
          Status
        </h3>
        <p>
          {order.status}
        </p>
      </CardInfo>
      <CardInfo>
        <h3>
          Dishes
        </h3>
      </CardInfo>
      <ul>
        {(order.dishes || []).map((orderDish: OrderDish, i) => (
          <li key={i}>
            {orderDish.dish.name}<br/>
          </li>
        ))}
      </ul>
      <ActionRow lineColor={statusToColor[order.status]}>
        { order.status === OrderStatus.WAITING && (
          <>
            <ActionButton color={red} onClick={() => _updateOrder(OrderStatus.REFUSED, order.paid)}>
              <X />
            </ActionButton>
            <ActionButton color={green} onClick={() => _updateOrder(OrderStatus.CONFIRMED, order.paid)}>
              <Check/>
            </ActionButton>
          </>
        )}
        { order.status === OrderStatus.CONFIRMED && (
          <ActionButton color={blue} onClick={() => _updateOrder(OrderStatus.FINISHED, order.paid)}>
            <Check/>
          </ActionButton>
        )}
        { order.paid !== true && order.status !== OrderStatus.REFUSED && order.status !== OrderStatus.WAITING && (
          <ActionButton color={green} onClick={() => _updateOrder(order.status, true)}>
            <DollarSign />
          </ActionButton>
        )}
      </ActionRow>
    </SingleOrder>
  );
}

const Orders = () => {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const myRestaurant = useSelector((state: ReduxState) => state.myRestaurant);

  const waitingOrders = myRestaurant?.orders?.filter((e) => e.status === OrderStatus.WAITING);
  const currentOrders = myRestaurant?.orders?.filter((e) => e.status === OrderStatus.CONFIRMED || (e.status === OrderStatus.FINISHED && !e.paid));
  const finishedOrders = myRestaurant?.orders?.filter((e) => (e.status === OrderStatus.FINISHED && e.paid) || e.status === OrderStatus.REFUSED);

  useEffect(() => {
    const interval = setInterval(() => {
      getMyRestaurant(dispatch, ws);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  })

  return (
    <Container>
      <OrderTypeContainer className="order-type">
        <OrderTypeName>
          Waiting
        </OrderTypeName>
        <OrderGrid>
          {waitingOrders?.map((order, i) => (
            <OrderCard key={i} order={order} />
          ))}
        </OrderGrid>
      </OrderTypeContainer>
      <OrderTypeContainer className="order-type">
        <OrderTypeName>
          Current
        </OrderTypeName>
        <OrderGrid>
          {currentOrders?.map((order, i) => (
            <OrderCard key={i} order={order} />
          ))}
        </OrderGrid>
      </OrderTypeContainer>
      <OrderTypeContainer className="order-type">
        <OrderTypeName>
          Finished
        </OrderTypeName>
        <OrderGrid>
          {finishedOrders?.map((order, i) => (
            <OrderCard key={i} order={order} />
          ))}
        </OrderGrid>
      </OrderTypeContainer>
    </Container>
  );
};

export default Orders;