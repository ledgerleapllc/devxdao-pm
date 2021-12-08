import { combineReducers } from 'redux';
import { createReducer } from '@shared/core/services/reducer-factory';

const userInitialState = null;

const setUser = (state, payload) => {
  return payload
};

const updateUser = (state, payload) => ({ ...state, ...payload });

const clearUser = state => userInitialState;

const userStrategies = {
  SET_USER: setUser,
  UPDATE_USER: updateUser,
  CLEAR_USER: clearUser,
  __default__: state => state,
};

export const user = createReducer(userStrategies, userInitialState);

export const authReducer = combineReducers({
  user,
});
