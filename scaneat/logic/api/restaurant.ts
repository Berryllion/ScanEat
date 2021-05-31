import axios from "axios";
import { Dispatch } from "redux";

import { SET_MY_RESTAURANT } from "../actions/restaurant";

import headers from "./headers";
import url from "./url";

interface RestaurantsParam {
  sort: string,
}
export const getRestaurants = async (_dispatch: Dispatch<any>, _ws: WebSocket | null, _params: RestaurantsParam) => {
  try {
    const response = await axios.get(`${url}/restaurants`, headers());
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const getRestaurant = async (_dispatch: Dispatch<any>, _ws: WebSocket | null, id: string) => {
  try {
    const response = await axios.get(`${url}/restaurant/${id}`, headers());
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const getMyRestaurant = async (dispatch: Dispatch<any>, _ws: WebSocket | null) => {
  try {
    const response = await axios.get(`${url}/restaurant/`, headers());
    dispatch({
      type: SET_MY_RESTAURANT,
      payload: response.data
    });
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}

interface UpdateCreateRestaurantParams {
  name: string;
  description: string;
  image: string;
  city: string;
  latt: number;
  long: number;
}
export const updateMyRestaurant = async (dispatch: Dispatch<any>, _ws: WebSocket | null, id: number, params: UpdateCreateRestaurantParams) => {
  try {
    const response = await axios.put(`${url}/restaurant/${id}`, params, headers());
    dispatch({
      type: SET_MY_RESTAURANT,
      payload: response.data
    });
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}
export const createMyRestaurant = async (dispatch: Dispatch<any>, _ws: WebSocket | null, params: UpdateCreateRestaurantParams) => {
  try {
    const response = await axios.post(`${url}/restaurant/`, params, headers());
    dispatch({
      type: SET_MY_RESTAURANT,
      payload: response.data
    });
    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response?.data};
  }
}