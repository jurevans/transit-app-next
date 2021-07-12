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
 * getLines - Split station line (e.g., B-D-F) into array of individual lines
 * @param {string} value
 * @returns {Array}
 */
export const getLines = (value: string = ''): string[] => value.split('-');

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
export const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) =>
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

export const hexToRGBArray = (hex: string): number[] => {
  hex = hex.toLowerCase();
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
   ] : [175, 175, 175];
};
