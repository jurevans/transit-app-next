import { ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
/*
import shapeFiles from '../../../data/shapeFiles';
import { StationsGeoDataItem } from '../../helpers/map';
import mapStyles, { MapStyles } from '../../settings/mapStyles';

// Static props to load to map at build time:
export const getStaticProps = async () => {
  const { lines, stations } = shapeFiles.nyc;

  return {
    props: {
      lines: JSON.parse(JSON.stringify(lines)),
      stations: JSON.parse(JSON.stringify(stations.features)),
      city: 'nyc',
      mapStyle: mapStyles.find(config => config.label === 'Dark') || mapStyles[0],
    },
  };
};

type Props = {
  city: string;
  mapStyle: MapStyles;
  stations: [StationsGeoDataItem];
  lines: any;
};
*/

const MapPage: NextPage = (): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const { style } = useAppSelector(state => state.mapStyle);

  return (
    <div>
      <Head>
        <title>Transit App Next - Map</title>
        <meta name="description" content="Transit App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map city={city} mapStyle={style} />
    </div>
  );
};

MapPage.getInitialProps = async (context: NextPageContext) => {
  console.log('context', context);
  return {};
};

export default MapPage;
