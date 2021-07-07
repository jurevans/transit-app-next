import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import settings from '../../settings';

const { cities } = settings;

interface CityState {
  value: string;
  range: any;
}
// Load the first city from the config
const city = Object.keys(cities)[0];

const initialState: CityState = {
  value: city,
  range: cities[city].settings.range,
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    updatedCity(state, action: PayloadAction<string>) {
      const city = action.payload;
      state.value = city;
      state.range = cities[city].settings.range;
    },
  },
});

export const { updatedCity } = citySlice.actions;
export default citySlice.reducer;
