const { REACT_APP_MAPBOX_ACCESS_TOKEN } = process.env;

module.exports = {
  reactStrictMode: false,
  env: {
    mapBoxAccessToken: REACT_APP_MAPBOX_ACCESS_TOKEN,
  },
};
