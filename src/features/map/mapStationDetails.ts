import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route } from "next/dist/next-server/server/router";
import { Coordinate } from "../../helpers/map";

interface MapStationDetailsData {
  properties: {
    name: string;
    routes: Route[];
  },
  coordinates: Coordinate;
}

interface MapStationDetailsState {
  data?: MapStationDetailsData,
  isOpen: boolean;
}

const initialState: MapStationDetailsState = {
  isOpen: false,
};

const mapStationDetailsSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    updatedStationDetails(state, action: PayloadAction<MapStationDetailsData>) {
      state.data = action.payload;
    },
    openStationDetails(state, action: PayloadAction<MapStationDetailsData>) {
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
