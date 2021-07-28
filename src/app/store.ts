import {
  configureStore, ThunkAction,
} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import rootReducer from '../features';

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;
export type AppDispatch = ReturnType<AppStore['dispatch']>;

export const useAppDispatch: typeof useDispatch = () => useDispatch();

export const wrapper = createWrapper<AppStore>(makeStore);
