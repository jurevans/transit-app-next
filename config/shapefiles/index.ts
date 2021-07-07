import stationsTriMet from './TriMet/stations';
import linesTriMet from './TriMet/lines';
import stationsMTA from './MTA/stations';
import linesMTA from './MTA/lines';

export {
  stationsMTA,
  linesMTA,
  stationsTriMet,
  linesTriMet,
};

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