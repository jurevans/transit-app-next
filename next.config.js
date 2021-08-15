const { REACT_APP_MAPBOX_ACCESS_TOKEN, GTFS_API } = process.env;

module.exports = {
  reactStrictMode: false,
  env: {
    mapBoxAccessToken: REACT_APP_MAPBOX_ACCESS_TOKEN,
    gtfsApiUrl: GTFS_API,
  },
};
