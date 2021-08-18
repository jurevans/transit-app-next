import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TripUpdates = {
  stationId: string;
  transfers: string[];
  routeIds: string[];
  stopTimeUpdates: any[];
};

type TripUpdatesState = {
  [key: string]: TripUpdates;
};

const initialState: TripUpdatesState = {};

const tripUpdatesSlice = createSlice({
  name: 'tripUpdates',
  initialState,
  reducers: {
    setTripUpdates(state, action: PayloadAction<any>) {
      const {
        feedIndex,
        stationId,
        transfers,
        routeIds,
        stopTimeUpdates,
      } = action.payload;

      state[feedIndex] = {
        stationId,
        transfers,
        routeIds,
        stopTimeUpdates,
      }
    },
  },
});

export const { setTripUpdates: setTripUpdates } = tripUpdatesSlice.actions;
export default tripUpdatesSlice.reducer;
