import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mapStyles, { MapStylesItem }  from '../../settings/mapStyles';

interface MapStyleState {
  style: MapStylesItem,
}

const initialStyle: MapStylesItem = mapStyles[3];

const initialState: MapStyleState = {
  style: initialStyle,
};

const mapStyleSlice = createSlice({
  name: 'mapStyles',
  initialState,
  reducers: {
    updatedMapStyle(state, action: PayloadAction<any>) {
      state.style = action.payload;
    },
  },
});

export const { updatedMapStyle } = mapStyleSlice.actions;
export default mapStyleSlice.reducer;
