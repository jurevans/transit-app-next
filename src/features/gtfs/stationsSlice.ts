import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface Stop {
  stopId: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Transfer {
  stopId: string;
  time: number;
}

type Transfers = {
  [key: string]: Transfer[];
};

type StationsState = {
  stops: Stop[],
  transfers: Transfers,
};

const initialState: StationsState = {
  stops: [],
  transfers: {},
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
    [HYDRATE] : (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload.gtfs.stations,
      };
    },
  },
});

export const { setStops: setStops, setTransfers: setTransfers } = stopsApiSlice.actions;
export default stopsApiSlice.reducer;
