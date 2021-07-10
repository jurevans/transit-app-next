import dashboardReducer from './dashboard/dashboardSlice';
import mapStyleReducer from './mapStyle/mapStyleSlice';
import mapPopupReducer from './map/mapPopupSlice';
import mapStationDetailsReducer from './map/mapStationDetails';
import cityReducer from './city/citySlice';
import linesReducer from './api/linesApiSlice';
import stationsReducer from './api/stationsApiSlice';
import statusReducer from './api/statusApiSlice';

const rootReducer = {
  dashboard: dashboardReducer,
  mapPopup: mapPopupReducer,
  mapStyle: mapStyleReducer,
  mapStationDetails: mapStationDetailsReducer,
  city: cityReducer,
  lines: linesReducer,
  stations: stationsReducer,
  status: statusReducer,
};

export default rootReducer;
