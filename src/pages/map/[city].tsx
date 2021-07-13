import { ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { wrapper } from '../../app/store';
import { fetchStations } from '../../features/api/stationsApiSlice';
import { fetchLines } from '../../features/api/linesApiSlice';
import { setCity } from '../../features/city/citySlice';
import { StationsGeoDataItem, LinesGeoData, getPathLayer } from '../../helpers/map';

type Props = {
  stations: StationsGeoDataItem[],
  lines: LinesGeoData;
  inboundData: any;
  outboundData: any;
}

const MapPage: NextPage<Props> = (props: Props): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const { style } = useAppSelector(state => state.mapStyle);
  const { stations, lines, inboundData, outboundData } = props;

  return (
    <div>
      <Head>
        <title>Transit App Next - Map</title>
        <meta name="description" content="Transit App - Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map city={city} mapStyle={style} stations={stations} lines={lines} inboundData={inboundData} outboundData={outboundData} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {
  const city = params?.city;

  await store.dispatch(fetchStations(city as string));
  await store.dispatch(fetchLines(city as string));
  await store.dispatch(setCity(city as string));

  const { stations } = store.getState();
  const { lines } = store.getState();

  const response: any = await fetch('http://localhost:3000/api/gtfs/lines/');
  const results = await response.json();

  const inboundData: any = [];
  const outboundData: any = [];

  results.forEach((result: any) => {
    if (result.inbound.length > 0) {
      inboundData.push({
        ...result.route,
        path: result.inbound,
      });
    }
    if (result.outbound.length > 0) {
      outboundData.push({
        ...result.route,
        path: result.outbound,
      });
    }
  });

  return {
    props: {
      stations: stations.data,
      lines: lines.data,
      inboundData,
      outboundData,
    },
  };
});

export default MapPage;
