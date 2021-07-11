require('dotenv').config();

const {
  REACT_APP_MAPBOX_ACCESS_TOKEN,
  REACT_APP_MTA_APP_ID,
  REACT_APP_MTA_REALTIME_ACCESS_KEY,
  MONGO_DB_CONNECT_STRING,
} = process.env;

module.exports = {
  reactStrictMode: false,
  env: {
    mapboxAccessToken: REACT_APP_MAPBOX_ACCESS_TOKEN,
    mtaAppId: REACT_APP_MTA_APP_ID,
    mtaRealtimeAccessKey: REACT_APP_MTA_REALTIME_ACCESS_KEY,
    mongoDBConnectString: MONGO_DB_CONNECT_STRING,
  },
};
