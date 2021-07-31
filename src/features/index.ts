import mapStyleReducer from './map/mapStyleSlice';
import mapPopupReducer from './map/mapPopupSlice';
import mapStationDetailsReducer from './map/mapStationDetails';
import agencyReducer from './api/agencySlice';
import statusReducer from './api/statusApiSlice';
import stationsReducer from './api/stationsApiSlice';
import gtfsReducer from './gtfs/gtfsSlice';

const rootReducer = {
  mapPopup: mapPopupReducer,
  mapStyle: mapStyleReducer,
  mapStationDetails: mapStationDetailsReducer,
  agency: agencyReducer,
  status: statusReducer,
  stations: stationsReducer,
  gtfs: gtfsReducer,
};

export default rootReducer;
