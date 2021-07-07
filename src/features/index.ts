import dashboardReducer from './dashboard/dashboardSlice';
import mapStyleReducer from './mapStyle/mapStyleSlice';
import mapPopupReducer from './map/mapPopupSlice';
import mapStationDetailsReducer from './map/mapStationDetails';
import cityReducer from './city/citySlice';
import { stationsApiSlice } from './api/stationsApiSlice';
import { linesApiSlice } from './api/linesApiSlice';
const rootReducer = {
  dashboard: dashboardReducer,
  mapPopup: mapPopupReducer,
  mapStyle: mapStyleReducer,
  mapStationDetails: mapStationDetailsReducer,
  city: cityReducer,
  [stationsApiSlice.reducerPath]: stationsApiSlice.reducer,
  [linesApiSlice.reducerPath]: linesApiSlice.reducer,
};

export default rootReducer;
