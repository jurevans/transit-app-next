import { ScatterplotLayer, GeoJsonLayer, TextLayer, PathLayer } from '@deck.gl/layers';
import { RGBAColor } from "@deck.gl/core/utils/color";
import { hexToRGBArray, RGBArray } from '../functions';

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
    getRadius: (d: any) => d.routes.length,
    getFillColor: (d: any): RGBAColor => {
      const rgbArray: RGBArray = d.colors
        ? hexToRGBArray(d.colors.split('-')[0])
        : [160, 160, 160];
      return [...rgbArray, 255];
    },
    getLineColor: (d: any): RGBAColor => {
      const colors = d.routes.map((route: any) => route.color);
      let useColor = colors[0];

      if (colors.length > 1) {
        // Find an alternate color
        const secondColor = colors.find((color: string) => color !== useColor);
        useColor = secondColor || useColor;
      }
      const rgbArray: RGBArray = hexToRGBArray(useColor);
      return [...rgbArray, 255];
    }
  });
};

export interface TooltipObject {
  x: number;
  y: number;
  line?: string;
  name?: string;
  longName?: string;
  routes?: any[];
  isStation?: boolean;
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
    routes: any[]; // TODO: Need type here.
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
    routes: object.routes,
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
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getLineColor: (d: any) => {
      const rgbArray: RGBArray = hexToRGBArray(d.properties.color);
      return [...rgbArray, 100];
    },
    getRadius: 100,
    getLineWidth: 1,
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
    getColor: (d: any): RGBAColor => {
      const rgbArray: RGBArray = hexToRGBArray(d.color);
      return [...rgbArray, 200];
    },
    getWidth: () => 2,
  });
};

export const getTextLabelTheme = (mapStyleLabel?: string): any => {
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
  const textLabelTheme = getTextLabelTheme(theme);
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
