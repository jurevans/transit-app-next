import { DateTime } from 'luxon';

/**
 * getInRange - Return a Lat/Lon value within a specified range
 * @param {number} value
 * @param {Array} range
 * @returns {number}
 */
export const getInRange = (value: number, range: number[]): number => {
  return Math.min(range[1], Math.max(range[0], value));
};

/**
 * getDurationForTransition - Get calculated duration based on difference between start/end lon/lat
 * @param props
 * @returns {number}
 */
export const getDurationForTransition =
  (props: {
    minDuration: number,
    startLon: number,
    endLon: number,
    startLat: number,
    endLat: number
  }): number => {
  const { minDuration, startLon, endLon, startLat, endLat } = props;

  // Get difference and convert to a reasonable milliseconds value
  const lonDiff = Math.abs(startLon - endLon);
  const latDiff = Math.abs(startLat - endLat);
  const calculatedDuration = Math.round(((latDiff * 20000) + (lonDiff * 20000)) / 2);

  return calculatedDuration > minDuration ? calculatedDuration : minDuration;
};

/**
 * getZoomForTransition - Get ideal zoom for this transition
 * @param {number} oldZoom
 * @param {number} minZoom
 * @returns {number}
 */
export const getZoomForTransition = (oldZoom: number, minZoom: number): number =>
  oldZoom > minZoom ? oldZoom : minZoom;

/**
 * getKeyValue - Returns the value of an Object at index "key"
 * @param obj
 * @returns {Function}
 */
export const getKeyValue = <T extends object, U extends keyof T>(obj: T): Function => (key: U) =>
  obj[key];

/**
 * Get object from array identified by key === value
 * @param {string} key
 * @param {string} value
 * @param array
 * @returns {Object}
 */
export const getKeyValueFromArray = (key: string, value: string, array: any[]) => 
  array.find(item => getKeyValue(item)(key) === value);

/**
 * hexToRGBArray - convert hex string to RGB array
 * @param {string} hex
 * @returns {Array}
 */
export type RGBArray = [number, number, number];
export const hexToRGBArray = (hex?: string): RGBArray => {
  hex = (hex ? hex : 'dddddd').toLowerCase();
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
   ] : [175, 175, 175];
};

/**
 * Given a time in seconds, return a formatted string denoting minutes,
 * e.g., how many minutes until a train arrives, or "Now" if minutes
 * is less than 1
 * @param {number} time
 * @param {string} timezone
 * @returns {number}
 */
export const formatMinUntil = (time: number, timezone: string) => {
  const now = DateTime.now().setZone(timezone).toSeconds();
  const minutes = (time - now) / 60;
  return minutes > 1 ? `${Math.round(minutes)} min` : 'Now';
};

/**
 * Given an indexed routes Object or array, return a sorted array, with routes grouped
 * by color
 * @param routesObj
 * @returns {any[]}
 */
export const getSortedRoutes = (routesObj: any) => {
  // Check for object:
  let routes: any[] = [];
  const routesKeys = Object.keys(routesObj);
  if (routesKeys.length > 0) {
    routes = routesKeys.map((key: any) => routesObj[key])
  }

  // Sort by routeShortName initially:
  routes.sort((a: any, b: any) => (a.routeShortName > b.routeShortName) ? -1 : 1);

  // Group by color:
  const groupedRoutes = routes.reduce((grouped: any, route: any) => {
    const { routeColor } = route;
    if (!grouped[routeColor]) {
      grouped[routeColor] = [];
    }
    grouped[routeColor].push(route);
    return grouped;
  }, {});

  // Flatten grouped arrays into a single array, then reverse:
  return Object.keys(groupedRoutes)
    .map((key: string) => groupedRoutes[key])
    .reduce((arr: any[], routeArr: any[]) => {
      arr.push(...routeArr);
      return arr;
    }, [])
    .reverse();
};

/**
 * Strip all HTML tags from text
 * @param {string} text
 * @returns {string}
 */
export const stripTags = (text: string) => {
  return text.replace(/(<([^>]+)>)/gi, '');
};
