type RouteList = string[];

export type ConfigItem = {
  feedIndex: number;
  routeGroupings?: RouteList[];
};

export type Config = ConfigItem[];

const gtfsConfig: Config = [
  {
    feedIndex: 1,
    // Specify route groupings if routes in feed are associated with
    // a line (e.g., NYC's MTA groups routes within historical lines)
    // using route IDs.
    // NOTE: This is optional:
    routeGroupings: [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7'],
      ['A', 'C', 'E'],
      ['B', 'D', 'F', 'M'],
      ['G'],
      ['J', 'Z'],
      ['L'],
      ['N', 'Q', 'R', 'W'],
      ['FS', 'GS', 'H'],
      ['SI'],
    ],
  }
];

export default gtfsConfig;
