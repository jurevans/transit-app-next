import * as stationsTriMet from './TriMet/stations.json';
import * as linesTriMet from './TriMet/lines.json';
import * as stationsMTA from './MTA/stations.json';
import * as linesMTA from './MTA/lines.json';
import * as boroughBoundaries from './nyc_boroughs.json';

export interface Boundary {
  label: string,
  color: [number, number, number];
  shapeData: any;
}

export interface ShapeFileData {
  [key: string]: {
    stations: any;
    lines: any;
    additionalBoundaries?: Boundary[] | undefined;
  };
}

const shapeFileData: ShapeFileData = {
  nyc: {
    stations: stationsMTA,
    lines: linesMTA,
    // Specify additional boundaries e.g., neighborhoods, etc.
    additionalBoundaries: [
      {
        label: 'Boroughs',
        color: [100, 100, 100], // RBG
        shapeData: boroughBoundaries,
      },
    ],
  },
  portland: {
    stations: stationsTriMet,
    lines: linesTriMet,
  },
};

export default shapeFileData;
