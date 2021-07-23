import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import settings from '../../settings';

const { cities } = settings;

interface CityState {
  value: string;
}
// TODO: This file will be removed soon one dependency on "city" is removed.
// Load the first city from the config
const cityConfig = cities[0];

const initialState: CityState = {
  value: cityConfig.id,
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCity(state, action: PayloadAction<string>) {
      const city = action.payload;
      state.value = city;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        value: action.payload.city.value,
      }
    },
  },
});

export const { setCity } = citySlice.actions;
export default citySlice.reducer;
