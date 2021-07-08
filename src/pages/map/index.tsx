import { ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { NextPage } from 'next';

const MapPage: NextPage = (): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const { style } = useAppSelector(state => state.mapStyle);

  return (
    <Map city={city} mapStyle={style.value} />
  )
};

export default MapPage;
