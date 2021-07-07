import { FC, ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';

const MapPage: FC = (): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const { style } = useAppSelector(state => state.mapStyle);

  return (
    <Map city={city} mapStyle={style.value} />
  )
};

export default MapPage;
