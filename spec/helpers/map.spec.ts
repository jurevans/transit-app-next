import {
  getStationData,
  getIcon,
  getLineColor,
  getLineLayer,
  getScatterplotLayer,
  getTooltipObjectLine,
  getTooltipObjectPlot,
  StationsGeoData,
  StationsGeoDataItem,
} from '../../src/helpers/map';

describe('getStationData', () => {
  test('Flattens the data within "properties" and "geometry"', () => {
    const stationDataItem: StationsGeoDataItem = {
      type: 'Point',
      properties: {
        name: '23 St',
        line: '1-2',
        notes: '1-all times, 2-nights',
        url: '',
      },
      geometry: {
        type: 'Point',
        coordinates: [-73.9956570016487, 40.74408099989751],
      },
    };
  
    const stationData: StationsGeoData = {
      features: [stationDataItem],
    };
  
    const expected = [{
      type: 'Point',
      name: '23 St',
      line: '1-2',
      notes: '1-all times, 2-nights',
      url: '',
      coordinates: [-73.9956570016487, 40.74408099989751],
    }];

    const actual = getStationData(stationData);
    expect(actual).toEqual(expected);
  })
});

describe('getIcon', () => {
  it('Returns null if no lines are found', () => {
    const expected = null;
    const actualWithInvalidCity = getIcon('denver', 'A');
    const actualWithInvalidLine = getIcon('nyc', 'I');
    expect(actualWithInvalidCity).toBe(expected);
    expect(actualWithInvalidLine).toBe(expected);
  });
});

describe('getLineColor', () => {

});

describe('getLineLayer', () => {

});

describe('getScatterplotLayer', () => {

});

describe('getTooltipObjectLine', () => {

});

describe('getScatterplotPlot', () => {

});