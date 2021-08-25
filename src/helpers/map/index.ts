import { ScatterplotLayer, GeoJsonLayer, TextLayer, PathLayer } from '@deck.gl/layers';
import { RGBAColor } from "@deck.gl/core/utils/color";
import { hexToRGBArray, RGBArray } from '../functions';

export interface Route {
  name: string;
  color: string | null;
  description: string;
  url: string;
  id: string;
  routeId: string;
}

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
    routeId?: string;
    routes?: Route[];
  }
}

export interface FeatureCollection {
  type: string;
  features: Feature[];
}

export interface PlotData {
  properties: {
    name: string;
    routes: Route[];
  },
  coordinates: Coordinate;
}

export const getScatterplotLayer = (data: PlotData[]) => {
  return new ScatterplotLayer({
    id: 'stations-scatterplot-layer',
    data,
    opacity: 0.8,
    stroked: true,
    filled: true,
    pickable: true,
    radiusScale: 6,
    radiusMinPixels: 3,
    radiusMaxPixels: 30,
    lineWidthMinPixels: 2,
    lineWidthMaxPixels: 5,
    getPosition: (d: any) =>  d.coordinates,
    getRadius: (d: any) => d.properties.routes.length,
    getFillColor: (d: any): RGBAColor => [255, 255, 255, 255],
    getLineColor: (d: any): RGBAColor => [0, 0, 0, 255],
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

export const getGeoJsonLayer = (data: FeatureCollection, selectedRouteId?: string) => {
  const id = selectedRouteId ? `geojson-line-layer-${selectedRouteId}` : 'geojson-line-layer';
  return new GeoJsonLayer({
    id,
    data,
    pickable: true,
    lineWidthScale: 10,
    lineWidthMinPixels: 2,
    getLineColor: (d: any) => {
      const { color, routeId } = d.properties;
      let opacity;
      if (selectedRouteId) {
        if (routeId === selectedRouteId) {
          opacity = 256;
        } else {
          opacity = 20;
        }
      } else {
        opacity = 160;
      }
      const rgbArray: RGBArray = hexToRGBArray(color);
      return [...rgbArray, opacity];
    },
    getPointRadius: 100,
    getLineWidth: (d: any) => {
      const { routeId } = d.properties;
      if (selectedRouteId && routeId === selectedRouteId) {
        return 3;
      }
      return 1;
    },
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

export const getTextLayer = (data: PlotData[], theme: string) => {
  const textLabelTheme = getTextLabelTheme(theme);
  const { fontColor, backgroundColor } = textLabelTheme;

  return new TextLayer({
    id: 'station-text-layer',
    data,
    pickable: true,
    billboard: true,
    sizeMaxPixels: 32,
    getPosition: (d: any) => d.coordinates,
    getText: (d: any) => d.properties.name,
    getSize: 14,
    getAngle: 0,
    getTextAnchor: 'start',
    getAlignmentBaseline: 'center',
    getPixelOffset: [40, 0],
    getColor: fontColor,
    getBackgroundColor: () => backgroundColor,
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
