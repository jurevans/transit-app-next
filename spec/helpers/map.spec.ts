import {
  getTextLabelTheme
} from '../../src/helpers/map';

describe('getTextLabelTheme', () => {
  it('Should return a Dark theme when "Dark" is provided', () => {
    const expected = {
      fontColor: [240, 240, 240, 255],
      backgroundColor: [40, 40, 40],
    };

    const actual = getTextLabelTheme('Dark');
    expect(actual).toEqual(expected);
  });

  it('Should return a default theme when no theme is provided', () => {
    const expected = {
      fontColor: [40, 40, 40, 255],
      backgroundColor: [240, 240, 240],
    };

    const actual = getTextLabelTheme();
    expect(actual).toEqual(expected);
  });

  it('Should return a default theme when any other theme is provided', () => {
    const expected = {
      fontColor: [40, 40, 40, 255],
      backgroundColor: [240, 240, 240],
    };

    const actual = getTextLabelTheme('test theme');
    expect(actual).toEqual(expected);
  });
})

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