type RouteList = string[];

type FeedConfig = {
  feedIndex: number;
  label: string;
  routeGroupings?: string[][];
  icon: string;
}

export type ConfigItem = {
  feedIndex: number;
  feeds: FeedConfig[];
  routeGroupings?: RouteList[];
  latitude: number;
  longitude: number;
};

export type Config = ConfigItem;

const gtfsConfig: Config = {
  feedIndex: 1,
  // TODO: The feeds config isn't implemented yet, it is just serving as a basis to incorporate
  // multiple feeds, and will be completed in a future PR:
  feeds: [
    // Note: Feeds will appear in UI in the order they are configured here:
    {
      feedIndex: 1,
      label: 'Subway',
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
      icon: '',
    },
    {
      feedIndex: 2,
      label: 'Bus',
      icon: '',
    },
    {
      feedIndex: 3,
      label: 'LIRR',
      icon: '',
    },
    {
      feedIndex: 4,
      label: 'NYC Ferry',
      icon: '',
    },
  ],
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
  latitude: 40.7227534777328,
  longitude: -73.94594865587045,
};

export default gtfsConfig;
