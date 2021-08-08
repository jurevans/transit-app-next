import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface Route {
  routeId: string;
  routeShortName: string;
  routeLongName: string;
  routeDesc: string;
  routeColor: string;
}

type RoutesState = {
  [key: string]: Route;
};

const initialState: RoutesState = {};

const routesApiSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    setRoutes(state, action: PayloadAction<Route[]>) {
      const routes = action.payload;
      routes.forEach((route: Route) => {
        state[route.routeId] = route;
      });
    },
  },
  extraReducers: {
    [HYDRATE] : (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload.gtfs.routes,
      };
    },
  },
});

export const { setRoutes: setRoutes } = routesApiSlice.actions;
export default routesApiSlice.reducer;
