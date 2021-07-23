import mapStyleReducer from './mapStyle/mapStyleSlice';
import mapPopupReducer from './map/mapPopupSlice';
import mapStationDetailsReducer from './map/mapStationDetails';
import agencyReducer from './agency/agencySlice';
import linesReducer from './api/linesApiSlice';
import stationsReducer from './api/stationsApiSlice';
import statusReducer from './api/statusApiSlice';

const rootReducer = {
  mapPopup: mapPopupReducer,
  mapStyle: mapStyleReducer,
  mapStationDetails: mapStationDetailsReducer,
  agency: agencyReducer,
  lines: linesReducer,
  stations: stationsReducer,
  status: statusReducer,
};

export default rootReducer;
