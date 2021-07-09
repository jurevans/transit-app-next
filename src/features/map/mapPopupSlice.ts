import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapPopupState {
  data?: {
    name: string;
    line: string;
    notes?: string;
    url?: string;
    isStation?: boolean;
    longitude: number;
    latitude: number;
  },
  isOpen: boolean;
}

const initialState: MapPopupState = {
  data: undefined,
  isOpen: false,
};

const mapPopupSlice = createSlice({
  name: 'map',
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
