import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapPopupState {
  data?: {
    routes: any[],
    isStation?: boolean;
    longitude: number;
    latitude: number;
  },
  isOpen: boolean;
}

const initialState: MapPopupState = {
  isOpen: false,
};

const mapPopupSlice = createSlice({
  name: 'mapPopup',
  initialState,
  reducers: {
    openPopup(state, action: PayloadAction<any>) {
      state.data = action.payload;
      state.isOpen = true;
    },
    closePopup(state) {
      state.isOpen = false;
    },
  },
});

export const { openPopup, closePopup } = mapPopupSlice.actions;
export default mapPopupSlice.reducer;
