import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import settings from '../../settings';

const { cities } = settings;

interface CityState {
  value: string;
  range: any;
}
// Load the first city from the config
const cityConfig = cities[0];

const initialState: CityState = {
  value: cityConfig.id,
  range: cityConfig.settings.range,
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    updatedCity(state, action: PayloadAction<string>) {
      const city = action.payload;
      const cityConfig = cities.find(config => config.id === city) || cities[0];
      state.value = city;
      state.range = cityConfig.settings.range;
    },
  },
});

export const { updatedCity } = citySlice.actions;
export default citySlice.reducer;
