import axios from "axios";
import { Dispatch } from "redux";

import url from "./url";
import headers from "./headers";
import { getMyRestaurant } from "./restaurant";

export const createDish = async (dispatch: Dispatch<any>, _ws: WebSocket | null, restaurantId: number, categoryId: number) => {
  try {
    const response = await axios.post(`${url}/dish/`, {
      name: 'New dish',
      description: '',
      image: '',
      price: 0,
      restaurantId,
      categoryId
    }, headers());
    await getMyRestaurant(dispatch, _ws);
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}

interface UpdateDishParams {
  name: string;
  description: string;
  image: string;
  price: number;
}
export const updateDish = async (dispatch: Dispatch<any>, _ws: WebSocket | null, dishId: number, params: UpdateDishParams) => {
  try {
    const response = await axios.put(`${url}/dish/${dishId}`, params, headers());
    await getMyRestaurant(dispatch, _ws);
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const deleteDish = async (dispatch: Dispatch<any>, _ws: WebSocket | null, dishId: number) => {
  try {
    const response = await axios.delete(`${url}/dish/${dishId}`, headers());
    await getMyRestaurant(dispatch, _ws);
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}