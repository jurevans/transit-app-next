import cities from '../../config/cities.config';

export interface CitySettings {
  id: string,
  label: string,
  transitAuthority: string;
  settings: {
    initialView: {
      minZoom: number,
      maxZoom: number,
      bearing: number,
      pitch: number,
      zoom: number,
      longitude: number,
      latitude: number,
    },
    range: {
      longitudeRange: number[],
      latitudeRange: number[],
    },
    serviceStatusEndpoint?: string;
  };
};

const defaults = {
  minZoom: 11,
  maxZoom: 15.5,
  bearing: 0,
  pitch: 0,
};

const citySettings = cities.map(config => ({
  ...config,
  settings: {
    ...config.settings,
    initialView: {
      ...defaults,
      ...config.settings.initialView,
    },
    range: {
      ...config.settings.range,
    },
  },
}));

export default citySettings;
