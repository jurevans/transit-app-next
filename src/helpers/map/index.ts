import { ScatterplotLayer, GeoJsonLayer, TextLayer, PathLayer } from '@deck.gl/layers';
import { RGBAColor } from "@deck.gl/core/utils/color";
import { PathStyleExtension } from '@deck.gl/extensions';
import settings from '../../settings';
import { getLines, hexToRGBArray } from '../functions';

const { lineColors, stationIcons } = settings;

export interface StationsGeoDataItem {
  type: string;
  properties: {
    name: string;
    line: string;
    notes?: string;
    url?: string;
  },
  geometry: {
    type: string;
    coordinates: number[];
  };
};

export interface LinesGeoDataFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    id: string;
    name: string;
    line: string;
    passage: string;
    status: string;
    type: string;
  };
}

export interface LinesGeoData {
  type: string;
  features: LinesGeoDataFeature[];
}

export const getStationData = (data: StationsGeoDataItem[]): any => {
  if (data && data.length > 0) {
    return data.map((station: StationsGeoDataItem) => {
      const properties = station.properties;
      const geometry = station.geometry;
      return {
        ...properties,
        ...geometry,
      }
    });
  }
};

export const getLineColor = (city: string, lines: string, opacity: number): RGBAColor => {
  const line = getLines(lines)[0];

  return lineColors[city] && lineColors[city][line]
    ? [...lineColors[city][line].rgb, opacity]
    : [160, 160, 160, opacity];
};

export const getIcon = (city: string, line: string): unknown => {
  return stationIcons[city] && stationIcons[city][line]
    ? stationIcons[city][line].icon
    : null;
};

export const getIcons = (city: string, line: string): any => {
  const lines = getLines(line);
  const icons = lines.map(line => ({
    icon: getIcon(city, line),
    line,
  }));
  return icons.filter(iconObj => iconObj.icon !== null);
};

export const getScatterplotLayer = (city: string, data: StationsGeoDataItem) => {
  return new ScatterplotLayer({
    id: 'stations-scatterplot-layer',
    data,
    opacity: 0.8,
    stroked: true,
    filled: true,
    pickable: true,
    radiusScale: 6,
    radiusMinPixels: 5,
    radiusMaxPixels: 30,
    lineWidthMinPixels: 3,
    getPosition: (d: any) =>  d.coordinates,
    getRadius: (d: any) => getLines(d.line).length,
    getFillColor: (d: any) => getLineColor(city, d.line, 255),
    getLineColor: (d: any) => {
      const lines = getLines(d.line);
      if (lines.length > 1) {
        const firstLine = lines[0];
        const secondLine = lines.find(line => line !== firstLine);
        if (secondLine) {
          return getLineColor(city, secondLine, 255);
        }
        return getLineColor(city, firstLine, 255);
      } else {
        return getLineColor(city, lines[0], 255);
      }
    }
  });
};

export interface TooltipObject {
  line: string;
  x: number;
  y: number;
  notes?: string;
  isStation?: boolean;
  name?: string;
}

export interface PickerLineObject {
  x: number;
  y: number;
  object: {
    properties: {
      name: string;
      x: number,
      y: number,
    },
  };
}

export interface PickerPlotObject {
  object: {
    name: string;
    line: string;
    notes: string;
  };
  x: number;
  y: number;
}

export const getTooltipObjectLine = (data: PickerLineObject): TooltipObject => {
  const { x, y, object } = data;
  return {
    line: object.properties.name,
    x,
    y,
  };
};

export const getTooltipObjectPlot = (data: PickerPlotObject): TooltipObject => {
  const { x, y, object } = data;
  return {
    name: object.name,
    line: object.line,
    notes: object.notes,
    isStation: true,
    x,
    y,
  };
}

export const isLinePicker = (data: PickerLineObject): boolean => {
  const { object } = data;
  return !!object.properties;
};

export const getLineLayer = (city: string, data: LinesGeoData) => {
  return new GeoJsonLayer({
    id: 'geojson-line-layer',
    data,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [160, 160, 180, 100],
    getLineColor: (d: any) => getLineColor(city, d.properties.name, 100),
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30
  });
};

export const getPathLayer = (id: string='path-layer', data: any) => {
  return new PathLayer({
    id,
    data,
    pickable: true,
    widthScale: 10,
    widthMinPixels: 1,
    rounded: true,
    getPath: (d: any) => d.path,
    getColor: (d: any) => [...hexToRGBArray(d.color), 200] as any,
    getWidth: () => 2,
    // Just testing that I can dash if needed:
    // getDashArray: [4, 3],
    // extensions: [new PathStyleExtension({highPrecisionDash: true})]
  });
}

const getTextLabelThemes = (mapStyleLabel: string): any => {
  switch (mapStyleLabel) {
    case 'Dark':
      return {
        fontColor: [240, 240, 240, 255],
        backgroundColor: [40, 40, 40],
      };
    default:
      return {
        fontColor: [40, 40, 40, 255],
        backgroundColor: [240, 240, 240],
      };
  }
};

export const getTextLayer = (data: any, theme: string) => {
  const textLabelTheme = getTextLabelThemes(theme);
  const { fontColor, backgroundColor } = textLabelTheme;

  return new TextLayer({
    id: 'station-text-layer',
    data,
    pickable: true,
    billboard: true,
    sizeMaxPixels: 32,
    getPosition: (d: any) => d.coordinates,
    getText: (d: any) => d.name,
    getSize: 24,
    getAngle: 0,
    getTextAnchor: 'start',
    getAlignmentBaseline: 'center',
    getPixelOffset: [40, 0],
    getColor: fontColor,
    backgroundColor: backgroundColor,
    fontFamily: 'Arial, Helvetica, sans-serif',
    maxWidth: 500,
    wordBreak: 'break-word',
    opacity: 0.5,
  });
};
