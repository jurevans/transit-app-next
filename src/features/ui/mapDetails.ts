import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coordinate, Route } from '../../helpers/map';

interface StationDetailsData {
  properties: {
    name: string;
    routes: Route[];
  },
  coordinates: Coordinate;
}

interface MapDetailsState {
  routeDetailsData?: any,
  stationData?: StationDetailsData,
  isRoutesOpen: boolean;
  isRouteDetailsOpen: boolean;
  isStationDetailsOpen: boolean;
}

const initialState: MapDetailsState = {
  routeDetailsData: {},
  isRoutesOpen: true,
  isRouteDetailsOpen: false,
  isStationDetailsOpen: false,
};

const mapDetailsSlice = createSlice({
  name: 'mapDetails',
  initialState,
  reducers: {
    updatedStationDetails(state, action: PayloadAction<StationDetailsData>) {
      state.stationData = action.payload;
    },
    openRoutes(state) {
      state.isRoutesOpen = true;
      state.isRouteDetailsOpen = false;
      state.isStationDetailsOpen = false;
    },
    openRouteDetails(state, action: PayloadAction<any>) {
      state.routeDetailsData = action.payload;
      state.isRoutesOpen = false;
      state.isRouteDetailsOpen = true;
      state.isStationDetailsOpen = false;
    },
    openStationDetails(state, action: PayloadAction<StationDetailsData>) {
      state.stationData = action.payload;
      state.isRoutesOpen = false;
      state.isRouteDetailsOpen = false;
      state.isStationDetailsOpen = true;
    },
  },
});

export const {
  updatedStationDetails,
  openRoutes,
  openRouteDetails,
  openStationDetails,
} = mapDetailsSlice.actions;
export default mapDetailsSlice.reducer;
