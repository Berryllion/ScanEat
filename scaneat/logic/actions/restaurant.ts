import { ReduxState } from "..";
import * as DataModel from '../types';

/* Actions */
export const SET_RESTAURANT = 'SET_RESTAURANT';
export const DEL_RESTAURANT = 'DEL_RESTAURANT';
export const SET_MY_RESTAURANT = 'SET_MY_RESTAURANT';
export const DEL_MY_RESTAURANT = 'DEL_MY_RESTAURANT';

/* Types */
export interface SetRestaurantAction {
  type: typeof SET_RESTAURANT;
  payload: DataModel.Restaurant;
}
export interface DelRestaurantAction {
  type: typeof DEL_RESTAURANT;
  payload: never;
}
export interface SetMyRestaurantAction {
  type: typeof SET_MY_RESTAURANT;
  payload: DataModel.Restaurant;
}
export interface DelMyRestaurantAction {
  type: typeof DEL_MY_RESTAURANT;
  payload: never;
}

export type Actions = SetRestaurantAction | DelRestaurantAction | SetMyRestaurantAction | DelMyRestaurantAction;

/* Functions */
export function setRestaurant(state: ReduxState, action: SetRestaurantAction): ReduxState {
  return {
    ...state,
    watchingRestaurant: action.payload,
  };
}
export function delRestaurant(state: ReduxState, _action: DelRestaurantAction): ReduxState {
  return {
    ...state,
    watchingRestaurant: null,
  };
}
export function setMyRestaurant(state: ReduxState, action: SetMyRestaurantAction): ReduxState {
  return {
    ...state,
    myRestaurant: action.payload,
  };
}
export function delMyRestaurant(state: ReduxState, _action: DelMyRestaurantAction): ReduxState {
  return {
    ...state,
    myRestaurant: null,
  };
}

/* Dispatches */
export const dispatches = [
  {
    action: SET_RESTAURANT,
    function: setRestaurant,
  },
  {
    action: DEL_RESTAURANT,
    function: delRestaurant
  },
  {
    action: SET_MY_RESTAURANT,
    function: setMyRestaurant,
  },
  {
    action: DEL_MY_RESTAURANT,
    function: delMyRestaurant
  }
];