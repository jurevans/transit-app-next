import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import settings from '../../settings';
import StationDetails from "../../ui/components/map/StationDetails";

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
    setCity(state, action: PayloadAction<string>) {
      const city = action.payload;
      const cityConfig = cities.find(config => config.id === city);
      state.value = city;
      state.range = cityConfig?.settings.range;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        value: action.payload.city.value,
        range: action.payload.city.range,
      }
    },
  },
});

export const { setCity } = citySlice.actions;
export default citySlice.reducer;
