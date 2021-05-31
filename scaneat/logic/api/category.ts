import axios from "axios";
import { Dispatch } from "redux";

import url from "./url";
import headers from "./headers";
import { getMyRestaurant } from "./restaurant";

export const createCategory = async (dispatch: Dispatch<any>, _ws: WebSocket | null, restaurantId: number) => {
  try {
    const response = await axios.post(`${url}/category/`, {
      restaurantId,
      name: 'New category'
    }, headers());
    await getMyRestaurant(dispatch, _ws);
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const updateCategory = async (dispatch: Dispatch<any>, _ws: WebSocket | null, categoryId: number, name: string) => {
  try {
    const response = await axios.put(`${url}/category/${categoryId}`, {
      name: name
    }, headers());
    await getMyRestaurant(dispatch, _ws);
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const deleteCategory = async (dispatch: Dispatch<any>, _ws: WebSocket | null, categoryId: number) => {
  try {
    const response = await axios.delete(`${url}/category/${categoryId}`, headers());
    await getMyRestaurant(dispatch, _ws);
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}