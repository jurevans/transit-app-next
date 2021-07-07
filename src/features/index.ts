import dashboardReducer from './dashboard/dashboardSlice';
import mapStyleReducer from './mapStyle/mapStyleSlice';
import mapPopupReducer from './map/mapPopupSlice';
import mapStationDetailsReducer from './map/mapStationDetails';
import cityReducer from './city/citySlice';

const rootReducer = {
  dashboard: dashboardReducer,
  mapPopup: mapPopupReducer,
  mapStyle: mapStyleReducer,
  mapStationDetails: mapStationDetailsReducer,
  city: cityReducer,
};

export default rootReducer;
