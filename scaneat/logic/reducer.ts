import { ReduxState } from './';
import * as General from './actions/general';
import * as Users from './actions/users';
import * as Restaurant from './actions/restaurant';

export type ActionTypes =
  General.Actions |
  Users.Actions |
  Restaurant.Actions;

export interface Dispatch {
  action: string,
  function: (state: ReduxState, action: ActionTypes) => ReduxState
};

// @ts-ignore
const allDispatches: Array<Dispatch> = [
  General.dispatches,
  Users.dispatches,
  Restaurant.dispatches,
].flat();

export function reducer(state: ReduxState, action: ActionTypes) {
  const dispatchAction = allDispatches.find((e) => e.action === action.type);

  if (dispatchAction)
    return dispatchAction.function(state, action);
  else
    return state;
}