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
export const getLines = (value: string): string[] => value.split('-');

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
   * @returns 
   */
export const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) =>
  obj[key];