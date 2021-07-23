import { ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { wrapper } from '../../app/store';
import { setCity } from '../../features/city/citySlice';
import { FeatureCollection } from '../../helpers/map';

type Props = {
  stations: any[],
  lines: FeatureCollection;
  location: any;
};

const MapPage: NextPage<Props> = (props: Props): ReactElement => {
  const city = useAppSelector(state => state.city.value);
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
        city={city}
        mapStyle={style}
        stations={stations}
        lines={lines}
        location={location} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {
  const city = params?.city;

  await store.dispatch(setCity(city as string));

  // Fetch location data for agency:
  const locationResponse = await fetch('http://localhost:3000/api/location');
  const location: any = await locationResponse.json();

  // Fetch stations:
  const stationsResponse: any = await fetch('http://localhost:5000/api/v1/stops');
  const stations = await stationsResponse.json();

  // Fetch route lines:
  const linesResponse: any = await fetch('http://localhost:5000/api/v1/shapes?geojson=true');
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
