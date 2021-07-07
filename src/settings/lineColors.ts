/**
 * Define colors for lines, by city, by line
 * RGB and HEX definitions
 */

type Color = {
  rgb: [number, number, number],
  hex: string,
};

type Colors = {
  [key: string]: Color,
};

const mtaColors: Colors = {
  red: {
    rgb: [238, 53, 46],
    hex: 'ee352e',
  },
  lightGreen: {
    rgb: [0, 147, 60],
    hex: '00933c',
  },
  darkGreen: {
    rgb: [0, 147, 60],
    hex: '00933c',
  },
  purple: {
    rgb: [185, 51, 173],
    hex: 'b933ad',
  },
  blue: {
    rgb: [0, 57, 166],
    hex: '0039a6',
  },
  yellow: {
    rgb: [252, 204, 10],
    hex: 'fccc0a',
  },
  orange: {
    rgb: [255, 99, 25],
    hex: 'ff6319',
  },
  brown: {
    rgb: [153, 102, 51],
    hex: '996633',
  },
  lightGray: {
    rgb: [167, 169, 172],
    hex: 'a7a9ac',
  },
  darkGray: {
    rgb: [128, 129, 131],
    hex: '808183',
  },
};

type LineColors = {
  [key: string]: {
    [key: string]: Color,
  }
};

/**
 * Assign colors to MTA lines
 */
const lineColors: LineColors = {
  nyc: {
    '1': mtaColors.red,
    '1 Express': mtaColors.red,
    '2': mtaColors.red,
    '3': mtaColors.red,
    '4': mtaColors.darkGreen,
    '5': mtaColors.darkGreen,
    '6': mtaColors.darkGreen,
    '6 Express': mtaColors.darkGreen,
    '7': mtaColors.purple,
    '7 Express': mtaColors.purple,
    'A': mtaColors.blue,
    'B': mtaColors.orange,
    'C': mtaColors.blue,
    'D': mtaColors.orange,
    'E': mtaColors.blue,
    'F': mtaColors.orange,
    'G': mtaColors.lightGreen,
    'J': mtaColors.brown,
    'L': mtaColors.lightGray,
    'M': mtaColors.orange,
    'N': mtaColors.yellow,
    'Q': mtaColors.yellow,
    'R': mtaColors.yellow,
    'W': mtaColors.yellow,
    'Z': mtaColors.brown,
    'S': mtaColors.darkGray,
    'SF': mtaColors.darkGray,
    'SIR': mtaColors.blue,
  },
  /*
  portland: {

  }
  */
};

export default lineColors;