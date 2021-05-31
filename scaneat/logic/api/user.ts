import axios from "axios";
import { Dispatch } from "redux";

import { SET_ME } from "../actions/users";
import { User, UserType } from "../types";

import url from "./url";
import headers from "./headers";
import { getMyRestaurant } from './restaurant';
import { RESET } from "../actions/general";

interface RegisterParams {
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  type: string
}
export const register = async (dispatch: Dispatch<any>, _ws: WebSocket | null, params: RegisterParams) => {
  try {
    const response = await axios.post(`${url}/user`, params);
    localStorage.setItem('token', response.data.token);
    const me: User = response.data;
    dispatch({
      type: SET_ME,
      payload: me,
    });
    if (me.type === UserType.PRO)
      await getMyRestaurant(dispatch, _ws);
    return { success: true, data: me };
  } catch (error) {
    localStorage.removeItem("token");
    return { succes: false, data: error.response?.data };
  }
}

interface LoginParams {
  email: string;
  password: string;
}
export const login = async (dispatch: Dispatch<any>, _ws: WebSocket | null, params: LoginParams) => {
  try {
    const response = await axios.post(`${url}/auth`, params);
    localStorage.setItem('token', response.data.token);
    const me: User = response.data;
    dispatch({
      type: SET_ME,
      payload: me,
    });
    if (me.type === UserType.PRO)
      await getMyRestaurant(dispatch, _ws);
    return { success: true, data: me };
  } catch (error) {
    localStorage.removeItem("token");
    return { succes: false, data: error.response?.data };
  }
}

export const getMe = async (dispatch: Dispatch<any>, _ws: WebSocket | null) => {
  try {
    const response = await axios.get(`${url}/user`, headers());
    localStorage.setItem('token', response.data.token);
    const me: User = response.data;
    dispatch({
      type: SET_ME,
      payload: me,
    });
    if (me.type === UserType.PRO)
      await getMyRestaurant(dispatch, _ws);
    return { success: true, data: me };
  } catch (error) {
    dispatch({
      type: RESET,
    })
    return { success: false, data: error.response?.data };
  }
}