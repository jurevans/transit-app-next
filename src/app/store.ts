import {
  configureStore,
} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer from '../features';
import { useMemo } from 'react';

const createStore = (preloadedState: any) => {
  // Ignore paths for static data
  const ignoredPaths = ['stations', 'lines'];
  return configureStore({
    reducer: rootReducer,
    preloadedState,
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
};

let store: any;

export const initializeStore = (preloadedState: any) => {
  let _store = store ?? createStore(preloadedState);
  if (preloadedState && store) {
   _store = createStore({ ...store.getState(), ...preloadedState });
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch: typeof useDispatch = () => useDispatch<AppDispatch>();
