import { ReduxState } from "..";
import * as DataModel from '../types';

/* Actions */
export const SET_ME = 'SET_ME';

/* Types */
export interface SetMeAction {
  type: typeof SET_ME;
  payload: DataModel.User;
}

export type Actions = SetMeAction;

/* Functions */
export function setMe(state: ReduxState, action: SetMeAction): ReduxState {
  return {
    ...state,
    me: action.payload,
  };
}

/* Dispatches */
export const dispatches = [
  {
    action: SET_ME,
    function: setMe,
  },
];