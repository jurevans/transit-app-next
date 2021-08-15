import { ReactElement } from 'react';
import { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Map from '../../ui/components/map/Map';
import { wrapper } from '../../app/store';
import { setAgency } from '../../features/gtfs/agencySlice';
import { setStops, setTransfers } from '../../features/gtfs/stationsSlice';
import { setRoutes } from '../../features/gtfs/routesSlice';
import { FeatureCollection } from '../../helpers/map';
import { API_URL } from '../../../config/api.config';
import SocketManager from '../../ui/components/socket/SocketManager';

type Props = {
  stations: any[],
  lines: FeatureCollection;
  location: any;
};

const MapPage: NextPage<Props> = (props: Props): ReactElement => {
  const { stations, lines, location } = props;

  return (
    <div>
      <Head>
        <title>Transit App Next - Map</title>
        <meta name="description" content="Transit App - Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SocketManager>
        <Map
          stations={stations}
          lines={lines}
          location={location} />
      </SocketManager>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {
  // Fetch feeds:
  const feedResponse = await fetch(`${API_URL}/api/feed`);
  const feed = await feedResponse.json();
  // In the future, there may be a configuration option to select which feed to load,
  // identified by associated agency. For now, load the first one:
  const { feedIndex, agencyId } = feed[0];

  // Fetch agency:
  const agencyResponse = await fetch(`${API_URL}/api/agency/${agencyId}?feedIndex=${feedIndex}`);
  const agency = await agencyResponse.json();

  // Fetch location data for feed:
  const locationResponse = await fetch(`${API_URL}/api/location/${feedIndex}`);
  const location: any = await locationResponse.json();

  await store.dispatch(setAgency({
    ...agency,
    location,
  }));

  // Fetch stations:
  const stationsResponse: any = await fetch(`${API_URL}/api/stations?feedIndex=${feedIndex}`);
  const stations = await stationsResponse.json();

  // Fetch route lines:
  const linesResponse: any = await fetch(`${API_URL}/api/lines?feedIndex=${feedIndex}`);
  const lines = await linesResponse.json();

  // Fetch stops:
  const stopsResponse: any = await fetch(`${API_URL}/api/stations/stops?feedIndex=${feedIndex}`);
  const stops = await stopsResponse.json();

  // Fetch transfers:
  const transfersResponse: any = await fetch(`${API_URL}/api/stations/transfers?feedIndex=${feedIndex}`);
  const transfers = await transfersResponse.json();

  await store.dispatch(setStops(stops));
  await store.dispatch(setTransfers(transfers));

  // Fetch routes:
  const routesResponse: any = await fetch(`${API_URL}/api/routes?feedIndex=${feedIndex}`);
  const routes = await routesResponse.json();

  await store.dispatch(setRoutes(routes));

  return {
    props: {
      stations,
      lines,
      location,
    },
  };
});

export default MapPage;
