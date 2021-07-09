import {
  configureStore, ThunkAction,
} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import rootReducer from '../features';

import { createWrapper } from 'next-redux-wrapper';


const makeStore = () => {
  // Ignore paths for static data
  const ignoredPaths = ['stations', 'lines'];
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: {
          ignoredPaths,
        },
        serializableCheck: {
          ignoredPaths,
        }
      }),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;
export type AppDispatch = ReturnType<AppStore['dispatch']>;

export const useAppDispatch: typeof useDispatch = () => useDispatch();

export const wrapper = createWrapper<AppStore>(makeStore);
