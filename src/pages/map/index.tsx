import { ReactElement } from 'react';
import { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Map from '../../ui/components/map/Map';
import { wrapper } from '../../app/store';
import { setFeeds } from '../../features/gtfs/feedsSlice';
import { setAgency } from '../../features/gtfs/agencySlice';
import { setRoutes } from '../../features/gtfs/routesSlice';
import { FeatureCollection } from '../../helpers/map';
import { API_URL } from '../../../config/api.config';
import SocketManager from '../../ui/components/socket/SocketManager';
import GTFSConfig from '../../../config/gtfs.config';

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
  const { latitude, longitude } = GTFSConfig;

  // Fetch feeds:
  const feedResponse = await fetch(`${API_URL}/api/feed`);
  const feedsData = await feedResponse.json();

  const feedIndicesQuery = feedsData.map((feed: any) => feed.feedIndex).join(',');
  const agenciesResponse = await fetch(`${API_URL}/api/agency/${feedIndicesQuery}`);
  const agencies = await agenciesResponse.json();

  const feeds = feedsData.map((feed: any) => ({
    ...feed,
    agencies: agencies.filter((agency: any) => agency.feedIndex === feed.feedIndex),
  }));

  await store.dispatch(setFeeds(feeds));

  // In the future, there may be a configuration option to select which feed to load,
  // identified by associated agency. For now, load the first one:
  const { feedIndex } = feeds[0];

  if (!feedIndex) {
    return {
      notFound: true,
    };
  }

  // Fetch agency:
  const agency = agencies[0];

  // Fetch location data for feed:
  let location: any;

  if (!latitude || !longitude) {
    const locationResponse = await fetch(`${API_URL}/api/location/${feedIndex}`);
    location = await locationResponse.json();
  } else {
    location = {
      latitude,
      longitude,
    };
  }

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
