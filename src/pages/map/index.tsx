import { ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { GetServerSideProps, NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { wrapper } from '../../app/store';
import { fetchStations } from '../../features/api/stationsApiSlice';
import { fetchLines } from '../../features/api/linesApiSlice';
import { StationsGeoDataItem } from '../../helpers/map';
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

type Props = {
  stations: StationsGeoDataItem[],
  lines: any;
}

const MapPage: NextPage<Props> = (props: { stations: StationsGeoDataItem[], lines: any }): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const { style } = useAppSelector(state => state.mapStyle);
  const { stations, lines } = props;

  return (
    <div>
      <Head>
        <title>Transit App Next - Map</title>
        <meta name="description" content="Transit App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map city={city} mapStyle={style} stations={stations} lines={lines} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async () => {
  // console.log('params', params);

  await store.dispatch(fetchStations('nyc'));
  await store.dispatch(fetchLines('nyc'));

  const { stations } = store.getState();
  const { lines } = store.getState();

  return {
    props: {
      stations: stations.data,
      lines: lines.data,
    },
  };
})

export default MapPage;
