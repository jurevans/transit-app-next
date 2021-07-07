import {
  stationsMTA,
  linesMTA,
  stationsTriMet,
  linesTriMet,
} from './shapefiles';

const cities = [
  {
    id: 'nyc',
    label: 'NYC',
    transitAuthority: 'MTA',
    settings: {
      initialView: {
        minZoom: 10,
        longitude: -73.926,
        latitude: 40.7128,
        zoom: 11.5,
      },
      range: {
        longitudeRange: [-74.2, -73.8],
        latitudeRange: [40.5, 40.9],
      },
      shapeFiles: {
        lines: linesMTA,
        stations: stationsMTA,
      },
    },
  },
  {
    id: 'portland',
    label: 'Portland',
    transitAuthority: 'TriMet',
    settings: {
      initialView: {
        longitude: -122.6750,
        latitude: 45.5151,
        zoom: 12.5,
      },
      range: {
        longitudeRange: [-122.73, -122.5],
        latitudeRange: [45.4, 45.6],
      }, shapeFiles: {
        lines: linesTriMet,
        stations: stationsTriMet,
      }
    },
  },
];

export default cities;
