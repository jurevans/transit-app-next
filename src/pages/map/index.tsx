import { ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { wrapper } from '../../app/store';
import { setAgency } from '../../features/agency/agencySlice';
import { FeatureCollection } from '../../helpers/map';
import { API_URL } from '../../../config/api.config';

type Props = {
  stations: any[],
  lines: FeatureCollection;
  location: any;
};

const MapPage: NextPage<Props> = (props: Props): ReactElement => {
  const { style } = useAppSelector(state => state.mapStyle);
  const { stations, lines, location } = props;

  return (
    <div>
      <Head>
        <title>Transit App Next - Map</title>
        <meta name="description" content="Transit App - Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map
        mapStyle={style}
        stations={stations}
        lines={lines}
        location={location} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {

  // Fetch agency:
  const agencyResponse = await fetch(`${API_URL}/api/agency`);
  const agency = await agencyResponse.json();
  // Fetch location data for agency:
  const locationResponse = await fetch(`${API_URL}/api/agency/${agency.agencyId}`);
  const location: any = await locationResponse.json();

  await store.dispatch(setAgency({
    ...agency,
    location,
  }));

  // Fetch stations:
  const stationsResponse: any = await fetch(`${API_URL}/api/stations`);
  const stations = await stationsResponse.json();

  // Fetch route lines:
  const linesResponse: any = await fetch(`${API_URL}/api/lines`);
  const lines = await linesResponse.json();

  return {
    props: {
      stations,
      lines,
      location,
    },
  };
});

export default MapPage;
