import { initialState, ReduxState } from "..";

/* Actions */
export const SET_TABLE = 'SET_TABLE';
export const SET_ON_SITE = 'SET_ON_SITE';
export const SET_AUTH_MODAL = 'SET_AUTH_MODAL';
export const RESET = 'RESET';

/* Types */
export interface SetTableAction {
  type: typeof SET_TABLE;
  payload: number | null;
}
export interface SetOnSiteAction {
  type: typeof SET_ON_SITE;
  payload: boolean;
}
export interface SetAuthModalAction {
  type: typeof SET_AUTH_MODAL;
  payload: boolean;
}
export interface ResetAction {
  type: typeof RESET;
  payload: never;
}

export type Actions = SetTableAction | SetOnSiteAction | SetAuthModalAction | ResetAction;

/* Functions */
export function setTable(state: ReduxState, action: SetTableAction): ReduxState {
  if (action.payload === null)
    sessionStorage.removeItem('table');
  else
    sessionStorage.setItem('table', action.payload.toString());
  return {
    ...state,
    table: action.payload,
  };
}
export function setOnSite(state: ReduxState, action: SetOnSiteAction): ReduxState {
  if (action.payload === false)
    sessionStorage.removeItem('onsite');
  else
    sessionStorage.setItem('onsite', 'true');
  return {
    ...state,
    onSite: action.payload,
  };
}
export function setAuthModal(state: ReduxState, action: SetAuthModalAction): ReduxState {
  return {
    ...state,
    authModal: action.payload,
  };
}
export function reset(_state: ReduxState, _action: ResetAction): ReduxState {
  localStorage.removeItem("token");
  return initialState;
}

/* Dispatches */
export const dispatches = [
  {
    action: SET_TABLE,
    function: setTable,
  },
  {
    action: SET_ON_SITE,
    function: setOnSite,
  },
  {
    action: SET_AUTH_MODAL,
    function: setAuthModal,
  },
  {
    action: RESET,
    function: reset
  },
];