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
  [key: string]: Entity;
}

const initialState: TripUpdatesState = {};

export const fetchTripUpdates = (feedIndex: number = 1, stationIds: string[]): AppThunk => async dispatch => {
  const response = await fetch(`${API_URL}/api/stations/gtfs/?feedIndex=${feedIndex}&id=${stationIds.join(',')}`);
  const data = await response.json();

  dispatch(gtfsSlice.actions.setTripUpdates(data));
};

const gtfsSlice = createSlice({
  name: 'tripUpdates',
  initialState,
  reducers: {
    setTripUpdates(state, action: PayloadAction<EntityPayload>) {
      const { data } = action.payload;
      if (data) {
        data.forEach((entity: Entity) => {
          state[entity.id] = entity;
        });
      }
    },
  },
});

export const { setTripUpdates: setTripUpdates } = gtfsSlice.actions;
export default gtfsSlice.reducer;
