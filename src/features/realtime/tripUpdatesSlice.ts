import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../../config/api.config';
import { AppThunk } from '../../app/store';

interface Entity {
  id: string;
  name: string;
  location: [number, number];
  stops: any;
  routes: string[];
}

interface EntityPayload {
  data: Entity[];
}

interface TripUpdatesState {
  stationId?: string;
  transfers?: string[];
  routeIds?: string[];
  stopTimeUpdates?: any[];
}

const initialState: TripUpdatesState = {};

export const fetchTripUpdates = (feedIndex: number = 1, stationIds: string[]): AppThunk => async dispatch => {
  const response = await fetch(`${API_URL}/api/stations/gtfs/?feedIndex=${feedIndex}&id=${stationIds.join(',')}`);
  const data = await response.json();

  dispatch(tripUpdatesSlice.actions.setTripUpdates(data));
};

const tripUpdatesSlice = createSlice({
  name: 'tripUpdates',
  initialState,
  reducers: {
    setTripUpdates(state, action: PayloadAction<any>) {
      console.log(action.payload)
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
