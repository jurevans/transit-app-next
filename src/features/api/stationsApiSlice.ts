/**
 * Api slice
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StationsGeoData } from '../../helpers/map';

const SERVER = 'http://localhost:3000';

export const fetchStations = createAsyncThunk(
  'stations/fetchByCity',
  async (city: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER}/api/stations/${city}`);
      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export interface StationsState {
  stations: any,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error?: any;
};

const initialState: StationsState = {
  stations: {},
  loading: 'idle',
  error: null,
};

const stationsApiSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setStations(state, action: PayloadAction<any>) {
      state.stations = action.payload;
      state.loading = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStations.fulfilled, (state, action: PayloadAction<StationsGeoData>) => {
      state.stations = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(fetchStations.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchStations.rejected, (state, action) => {
      state.error = action.error;
      state.loading = 'failed';
    });
  },
});

export const { setStations } = stationsApiSlice.actions;
export default stationsApiSlice.reducer;
