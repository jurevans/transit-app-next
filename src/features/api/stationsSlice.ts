import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface StationsState {
  stops: any[],
  transfers: any,
};

const initialState: StationsState = {
  stops: [],
  transfers: null,
};

const stopsApiSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setStops(state, action: PayloadAction<any[]>) {
      state.stops = action.payload;
    },
    setTransfers(state, action: PayloadAction<any>) {
      state.transfers = action.payload;
    }
  },
  extraReducers: {
    [HYDRATE] : (state, action: any) => {
      return {
        ...state,
        ...action.payload.stations,
      };
    },
  },
});

export const { setStops: setStops, setTransfers: setTransfers } = stopsApiSlice.actions;
export default stopsApiSlice.reducer;
