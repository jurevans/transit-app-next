import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TripUpdatesState {
  stationId?: string;
  transfers?: string[];
  routeIds?: string[];
  stopTimeUpdates?: any[];
}

const initialState: TripUpdatesState = {};

const tripUpdatesSlice = createSlice({
  name: 'tripUpdates',
  initialState,
  reducers: {
    setTripUpdates(state, action: PayloadAction<any>) {
      const { stationId, transfers, routeIds, stopTimeUpdates } = action.payload;
      state.stationId = stationId;
      state.transfers = transfers;
      state.routeIds = routeIds;
      state.stopTimeUpdates = stopTimeUpdates;
    },
  },
});

export const { setTripUpdates: setTripUpdates } = tripUpdatesSlice.actions;
export default tripUpdatesSlice.reducer;
