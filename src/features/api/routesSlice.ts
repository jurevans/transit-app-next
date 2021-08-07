import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface RoutesState {
  data: any[],
};

const initialState: RoutesState = {
  data: [],
};

const routesApiSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    setRoutes(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE] : (state, action: any) => {
      return {
        ...state,
        ...action.payload.routes,
      };
    },
  },
});

export const { setRoutes: setRoutes } = routesApiSlice.actions;
export default routesApiSlice.reducer;
