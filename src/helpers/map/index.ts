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
    getRadius: (d: any) => d.properties.routes.length,
    getFillColor: (d: any): RGBAColor => {
      const rgbArray: RGBArray = hexToRGBArray(d.properties.routes[0].color);
      return [...rgbArray, 255];
    },
    getLineColor: (d: any): RGBAColor => {
      const colors = d.properties.routes.map((route: any) => route.color);
      let useColor = colors[0];

      const secondColor = colors.find((color: string) => color !== useColor);
      useColor = secondColor || useColor;
      const rgbArray: RGBArray = hexToRGBArray(useColor);
      return [...rgbArray, 255];
    }
  });
};

export interface TooltipObject {
  x: number;
  y: number;
  name?: string;
  longName?: string;
  routes?: any[];
  routeId?: string;
  isStation?: boolean;
}

// The diferences between the following two should be abstracted out:
export interface PickerObject {
  x: number;
  y: number;
  object: {
    properties: {
      name: string,
      longName: string,
      routes?: any[],
      routeId?: string,
      x: number,
      y: number,
    },
  };
}

export const getTooltipObject = (data: PickerObject, isStation?: boolean): TooltipObject => {
  const { x, y, object } = data;
  return {
    name: object.properties.name,
    routes: object.properties.routes,
    longName: object.properties.longName,
    routeId: object.properties.routeId,
    isStation,
    x,
    y,
  };
}

export const isPlotPicker = (data: PickerObject): boolean => {
  const { object } = data;
  return !!object.properties.routes;
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

/**
 * Get a formatted icon path based on agencyId and routeId
 * @param {string} agencyId
 * @param {string} routeId
 * @returns {string}
 */
export const getIconPath = (agencyId: string, routeId: string) =>
  `/icons/${agencyId}/${routeId}.svg`;
