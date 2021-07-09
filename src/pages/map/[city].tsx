import { ContextType, ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Head from 'next/head';
import { wrapper } from '../../app/store';
import { fetchStations } from '../../features/api/stationsApiSlice';
import { fetchLines } from '../../features/api/linesApiSlice';
import { setCity } from '../../features/city/citySlice';
import { StationsGeoDataItem, LinesGeoData } from '../../helpers/map';

type Props = {
  stations: StationsGeoDataItem[],
  lines: LinesGeoData;
}

const MapPage: NextPage<Props> = (props: { stations: StationsGeoDataItem[], lines: LinesGeoData }): ReactElement => {
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

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {
  // TODO: Look into "Property 'city' does not exist on type 'ParsedUrlQuery | undefined'.",
  // then make TypeScript happy.
  const { city } = params;

  await store.dispatch(fetchStations(city));
  await store.dispatch(fetchLines(city));
  await store.dispatch(setCity(city));

  const { stations } = store.getState();
  const { lines } = store.getState();

  return {
    props: {
      stations: stations.data,
      lines: lines.data,
    },
  };
});

export default MapPage;
