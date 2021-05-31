import { useMemo } from 'react';
import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Actions from './reducer';
import { ActionTypes } from './reducer';
import * as DataModel from './types';

export interface ReduxState {
  me: DataModel.User | null;
  ws: WebSocket | null;
  myRestaurant: DataModel.Restaurant | null;
  watchingRestaurant: DataModel.Restaurant | null;
  table: number | null;
  onSite: boolean;
  authModal: boolean;
}

let store: Store<ReduxState, ActionTypes> | undefined;

export const initialState: ReduxState = {
  me: null,
  ws: null,
  myRestaurant: null,
  watchingRestaurant: null,
  table: null,
  onSite: false,
  authModal: false,
};

const reducer = (state = initialState, action: ActionTypes) => {
  return Actions.reducer(state, action);
};

function initStore(preloadedState = initialState): Store<ReduxState, ActionTypes> {
  return createStore(reducer, preloadedState, composeWithDevTools(applyMiddleware())) as Store<ReduxState, ActionTypes>;
}

export const initializeStore = (preloadedState: ReduxState): Store<ReduxState, ActionTypes> => {
  let newStore = store ?? initStore(preloadedState);

  if (preloadedState && store) {
    newStore = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined;
  }

  if (typeof window === 'undefined') return newStore;
  if (!store) store = newStore;

  return newStore;
};

export function useStore(newInitialState: ReduxState): Store<ReduxState, ActionTypes> {
  const newStore = useMemo(() => initializeStore(newInitialState), [newInitialState]);
  return newStore;
}
