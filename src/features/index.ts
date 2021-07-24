import mapStyleReducer from './map/mapStyleSlice';
import mapPopupReducer from './map/mapPopupSlice';
import mapStationDetailsReducer from './map/mapStationDetails';
import agencyReducer from './agency/agencySlice';
import statusReducer from './api/statusApiSlice';

const rootReducer = {
  mapPopup: mapPopupReducer,
  mapStyle: mapStyleReducer,
  mapStationDetails: mapStationDetailsReducer,
  agency: agencyReducer,
  status: statusReducer,
};

export default rootReducer;
