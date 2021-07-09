import * as stationsTriMet from './TriMet/stations.json';
import * as linesTriMet from './TriMet/lines.json';
import * as stationsMTA from './MTA/stations.json';
import * as linesMTA from './MTA/lines.json';

export interface ShapeFileData {
  [key: string]: {
    stations: any;
    lines: any;
  };
};

const shapeFileData: ShapeFileData = {
  nyc: {
    stations: stationsMTA,
    lines: linesMTA,
  },
  portland: {
    stations: stationsTriMet,
    lines: linesTriMet,
  },
};

export default shapeFileData;
