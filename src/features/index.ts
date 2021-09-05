import { combineReducers } from '@reduxjs/toolkit';
import mapStyleReducer from './ui/mapStyleSlice';
import mapPopupReducer from './ui/mapPopupSlice';
import stationDetailsReducer from './ui/mapDetails';
import feedsReducer from './gtfs/feedsSlice';
import agencyReducer from './gtfs/agencySlice';
import stationsReducer from './gtfs/stationsSlice';
import routesReducer from './gtfs/routesSlice';
import tripUpdatesReducer from './realtime/tripUpdatesSlice';
import alertsReducer from './realtime/alertsSlice';

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
    feeds: feedsReducer,
  }),
  realtime: combineReducers({
    tripUpdates: tripUpdatesReducer,
    alerts: alertsReducer,
  }),
};

export default rootReducer;
