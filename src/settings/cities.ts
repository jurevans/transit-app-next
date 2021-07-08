import cities from '../../config/cities.config';

export interface CitySettings {
  [key: string]: {
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
    };
  };
};

const defaults = {
  minZoom: 11,
  maxZoom: 15.5,
  bearing: 0,
  pitch: 0,
};

/*
const initalAccumulator: CitySettings = {};
const citySettings: CitySettings = cities.reduce((newConfig, config) => {
  newConfig[config.id] = {
    ...config,
    settings: {
      initialView: {
        ...defaults,
        ...config.settings.initialView,
      },
      range: {
        ...config.settings.range,
      },
    },
  };
  return newConfig;
}, initalAccumulator);
*/

const citySettings = cities.map(config => ({
  ...config,
    settings: {
      initialView: {
        ...defaults,
        ...config.settings.initialView,
      },
      range: {
        ...config.settings.range,
      },
    },
  }),
);

export default citySettings;
