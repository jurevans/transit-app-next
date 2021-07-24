import {
  getInRange,
  getDurationForTransition,
  getZoomForTransition,
} from '../../src/helpers/functions';

const range = [20, 50];

describe('getInRange', () => {
  it('Returns a value within the range', () => {
    const expected = 30;
    const actual = getInRange(30, range);
    expect(actual).toBe(expected);
  });

  it('Returns the min value when provided a number below the range', () => {
    const expected = 20;
    const actual = getInRange(10, range);
    expect(actual).toBe(expected);
  });

  it('Returns the max value when provided a number above the range', () => {
    const expected = 50;
    const actual = getInRange(60, range);
    expect(actual).toBe(expected);
  });
});

describe('getDurationForTransition', () => {
  it('Returns the correct duration for a given lat/lon pair', () => {
    const props = {
      minDuration: 375,
      startLon: -73.926,
      endLon: -73.98869800128737,
      startLat: 40.7128,
      endLat: 40.74545399979951,
    };

    const expected = 954;
    const actual = getDurationForTransition(props);
    expect(actual).toBe(expected);
  });
});

describe('getZoomForDuration', () => {
  it('Returns the minZoom if oldZoom is less than minZoom', () => {
    const oldZoom = 12.596117833833905;
    const minZoom = 14;
    const expected = minZoom;
    const actual = getZoomForTransition(oldZoom, minZoom);
    expect(actual).toBe(expected);
  });

  it('Returns oldZoom if oldZoom is greater than minZoom', () => {
    const oldZoom = 14.548058916916952;
    const minZoom = 14;
    const expected = oldZoom;
    const actual = getZoomForTransition(oldZoom, minZoom);
    expect(actual).toBe(expected);
  });
});
