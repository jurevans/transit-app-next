import { ScatterplotLayer, GeoJsonLayer, TextLayer, PathLayer } from '@deck.gl/layers';
import { RGBAColor } from "@deck.gl/core/utils/color";
import { PathStyleExtension } from '@deck.gl/extensions';
import settings from '../../settings';
import { getLines, hexToRGBArray } from '../functions';

const { stationIcons } = settings;

export type Coordinate = [number, number];

export interface Geometry {
  type: 'LineString' | 'Point' | 'Polygon'; // There are others, but will not likely be used here
  coordinates: Coordinate[];
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: {
    name: string;
    color?: string;
    description?: string;
    url?: string;
    id?: string;
    routeid?: string;
  }
}

export interface FeatureCollection {
  type: string;
  features: Feature[];
}

// OBSOLETE
export const getStationData = (data: Feature[]): any => {
  if (data && data.length > 0) {
    return data.map((station: Feature) => {
      const properties = station.properties;
      const geometry = station.geometry;
      return {
        ...properties,
        ...geometry,
      }
    });
  }
};

// OBSOLETE
export const getIcon = (city: string, line: string): unknown => {
  return stationIcons[city] && stationIcons[city][line]
    ? stationIcons[city][line].icon
    : null;
};

// OBSOLETE - Remove when icons can be added to public assets
export const getIcons = (city: string, line: string): any => {
  const lines = getLines(line);
  const icons = lines.map(line => ({
    icon: getIcon(city, line),
    line,
  }));
  return icons.filter(iconObj => iconObj.icon !== null);
};

export const getScatterplotLayer = (data: any) => {
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
    getFillColor: (d: any): RGBAColor => {
      return d.colors
        ? [...hexToRGBArray(d.colors.split('-')[0]), 255]
        : [160, 160, 160, 255];
    },
    getLineColor: (d: any): RGBAColor => {
      const colors = d.colors ? d.colors.split('-') : [];
      let useColor = colors[0];

      if (colors.length > 1) {
        // Find an alternate color
        const secondColor = colors.find((color: string) => color !== useColor);
        useColor = secondColor || useColor;
      }

      return [...hexToRGBArray(useColor), 255];
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
  longName?: string;
}

// The diferences between the following two should be abstracted out:
export interface PickerLineObject {
  x: number;
  y: number;
  object: {
    properties: {
      name: string;
      longName?: string;
      x: number,
      y: number,
    },
  };
}
// Perhaps data for PickerPlot should follow "Feature" properties,
// and then this interface can be consolidated with the above interface?
export interface PickerPlotObject {
  object: {
    name: string;
    line: string; // Line should go. It was only useful to have for older data.
    longName: string;
  };
  x: number;
  y: number;
}

export const getTooltipObjectLine = (data: PickerLineObject): TooltipObject => {
  const { x, y, object } = data;
  return {
    line: object.properties.name,
    longName: object.properties.longName,
    x,
    y,
  };
};

// This could be consolidated into the above, or removed entirely
// Data should be delivered in GeoJSON Feature & FeatureCollection format
export const getTooltipObjectPlot = (data: PickerPlotObject): TooltipObject => {
  const { x, y, object } = data;
  return {
    name: object.name,
    line: object.line,
    longName: object.longName,
    isStation: true,
    x,
    y,
  };
}

export const isLinePicker = (data: PickerLineObject): boolean => {
  const { object } = data;
  return !!object.properties;
};

export const getGeoJsonLayer = (data: FeatureCollection) => {
  return new GeoJsonLayer({
    id: 'geojson-line-layer',
    data,
    pickable: true,
    //stroked: false,
    //filled: true,
    //extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    //getFillColor: [160, 160, 180, 100],
    getLineColor: (d: any) => [...hexToRGBArray(d.properties.color), 100],
    getRadius: 100,
    getLineWidth: 1,
    //getElevation: 30
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
    getOffset: () => 1,
    extensions: [new PathStyleExtension({ offset: true })]
  });
};

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
