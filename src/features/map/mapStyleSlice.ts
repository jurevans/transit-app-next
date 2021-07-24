import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mapStyles, { MapStylesItem }  from '../../settings/mapStyles';

interface MapStyleState {
  style?: MapStylesItem,
}

const initialStyle = mapStyles.find(style => style.label === 'Dark');

const initialState: MapStyleState = {
  style: initialStyle,
};

const mapStyleSlice = createSlice({
  name: 'mapStyle',
  initialState,
  reducers: {
    updatedMapStyle(state, action: PayloadAction<any>) {
      state.style = action.payload;
    },
  },
});

export const { updatedMapStyle } = mapStyleSlice.actions;
export default mapStyleSlice.reducer;
