/**
 * MapBox styles for react-map-gl
 */

export type MapStylesItem = {
  id: string;
  label: string;
  value: string;
}

export type MapStyles = MapStylesItem[];

const mapStyles: MapStyles = [
  {
    id: '1',
    label: 'Streets',
    value: 'mapbox://styles/mapbox/streets-v11',
  },
  {
    id: '2',
    label: 'Outdoors',
    value: 'mapbox://styles/mapbox/outdoors-v11',
  },
  {
    id: '3',
    label: 'Light',
    value: 'mapbox://styles/mapbox/light-v10',
  },
  {
    id: '4',
    label: 'Dark',
    value: 'mapbox://styles/mapbox/dark-v10',
  },
  {
    id: '5',
    label: 'Satellite',
    value: 'mapbox://styles/mapbox/satellite-v9',
  },
  {
    id: '6',
    label: 'Satellite - Streets',
    value: 'mapbox://styles/mapbox/satellite-streets-v11',
  },
  {
    id: '7',
    label: 'Navigation - Day',
    value: 'mapbox://styles/mapbox/navigation-day-v1',
  },
  {
    id: '8',
    label: 'Navigation - Night',
    value: 'mapbox://styles/mapbox/navigation-night-v1',
  },
];

export default mapStyles;
