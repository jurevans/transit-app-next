import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StationsGeoDataItem } from '../../helpers/map';
import { HYDRATE } from 'next-redux-wrapper';
import { AppThunk } from '../../app/store';

const SERVER = 'http://localhost:3000';

export const fetchStations = (city: string): AppThunk => async dispatch => {
  const response = await fetch(`${SERVER}/api/stations/${city}`);
  const stations = await response.json();

  dispatch(stationsApiSlice.actions.setStations(stations.features));
};

export interface StationsState {
  data: StationsGeoDataItem[],
};

const initialState: StationsState = {
  data: [],
};

const stationsApiSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setStations(state, action: PayloadAction<any>) {
      state.data = action.payload;
    }
  },
  extraReducers: {
    [HYDRATE] : (state, action: any) => {
      return {
        ...state,
        data: action.payload.stations.data,
      };
    },
  },
});

export const { setStations } = stationsApiSlice.actions;
export default stationsApiSlice.reducer;
