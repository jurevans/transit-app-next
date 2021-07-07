import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapStationDetailsState {
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

const initialState: MapStationDetailsState = {
  data: null,
  isOpen: false,
};

const mapStationDetailsSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    updatedStationDetails(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    openStationDetails(state, action: PayloadAction<any>) {
      state.data = action.payload;
      state.isOpen = true;
    },
    closeStationDetails(state) {
      state.isOpen = false;
    },
  },
});

export const {
  updatedStationDetails,
  openStationDetails,
  closeStationDetails,
} = mapStationDetailsSlice.actions;
export default mapStationDetailsSlice.reducer;
