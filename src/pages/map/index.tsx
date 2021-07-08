import { ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { NextPage } from 'next';
import Head from 'next/head';

const MapPage: NextPage = (): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const { style } = useAppSelector(state => state.mapStyle);
  const { lines } = useAppSelector(state => state.lines);
  const { stations } = useAppSelector(state => state.stations);

  return (
    <div>
      <Head>
        <title>Transit App Next - Map</title>
        <meta name="description" content="Transit App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map city={city} mapStyle={style} stations={stations} lines={lines} />
    </div>
  )
};

export default MapPage;
