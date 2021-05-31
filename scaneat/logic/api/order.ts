import axios from "axios";
import { Dispatch } from "redux";
import { Dish, OrderStatus, Restaurant } from "../types";
import headers from "./headers";
import { getMyRestaurant } from "./restaurant";
import url from "./url";

interface SendOrderParam {
  restaurant: Restaurant;
  orderDishes: Array<Dish>;
  table: number;
}
export const sendOrder = async (_dispatch: Dispatch<any>, _ws: WebSocket | null, params: SendOrderParam) => {
  try {
    const response = await axios.post(`${url}/order`,
      {
        restaurantId: params.restaurant.id,
        dishesId: params.orderDishes.map((d) => d.id),
        table: params.table,
      },
      headers()
    );
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const payOrder = async (_dispatch: Dispatch<any>, _ws: WebSocket | null, token: string) => {
  try {
    const response = await axios.patch(`${url}/order/pay`,
      {},
      {
        headers: {
          ...headers().headers,
          'ordertoken': token
        }
      }
    );
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const getOrderByToken = async (_dispatch: Dispatch<any>, _ws: WebSocket | null, token: string) => {
  try {
    const response = await axios.get(`${url}/order/token`,
      {
        headers: {
          ...headers().headers,
          'ordertoken': token
        }
      }
    );
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const updateOrder = async (dispatch: Dispatch<any>, _ws: WebSocket | null, id: number, status: OrderStatus, paid: boolean) => {
  try {
    const response = await axios.patch(`${url}/order/${id}`,
      {
        status,
        paid,
      },
      headers()
    );
    await getMyRestaurant(dispatch, _ws);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: error.response?.data };
  }
}