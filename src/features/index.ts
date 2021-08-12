import { combineReducers } from '@reduxjs/toolkit';
import mapStyleReducer from './ui/mapStyleSlice';
import mapPopupReducer from './ui/mapPopupSlice';
import stationDetailsReducer from './ui/mapStationDetails';
import agencyReducer from './gtfs/agencySlice';
import statusReducer from './realtime/statusSlice';
import stationsReducer from './gtfs/stationsSlice';
import routesReducer from './gtfs/routesSlice';
import tripUpdatesReducer from './realtime/tripUpdatesSlice';

const rootReducer = {
  ui: combineReducers({
    mapPopup: mapPopupReducer,
    mapStyle: mapStyleReducer,
    stationDetails: stationDetailsReducer,
  }),
  gtfs: combineReducers({
    agency: agencyReducer,
    stations: stationsReducer,
    routes: routesReducer,
  }),
  realtime: combineReducers({
    tripUpdates: tripUpdatesReducer,
    status: statusReducer,
  }),
};

export default rootReducer;
