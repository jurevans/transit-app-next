import cities from '../../config/cities.config';

export interface CitySettings {
  id: string,
  label: string,
  transitAuthority: string;
  settings: {
    serviceStatusEndpoint?: string;
  };
};

/* This is going away - all that is left to remove is service-status endpoint. */
const citySettings = cities.map(config => ({
  ...config,
}));

export default citySettings;
