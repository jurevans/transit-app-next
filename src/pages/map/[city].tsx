import { ReactElement } from 'react';
import Map from '../../ui/components/map/Map';
import { useAppSelector } from '../../app/hooks';
import { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';
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

const MapPage: NextPage<Props> = (props: Props): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const { style } = useAppSelector(state => state.mapStyle);
  const { stations, lines } = props;

  return (
    <div>
      <Head>
        <title>Transit App Next - Map</title>
        <meta name="description" content="Transit App - Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map city={city} mapStyle={style} stations={stations} lines={lines} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {
  const city = params?.city;

  await store.dispatch(fetchStations(city as string));
  await store.dispatch(fetchLines(city as string));
  await store.dispatch(setCity(city as string));

  //const { stations } = store.getState();
  //const { lines } = store.getState();

  // TODO: Move this out of getServerSideProps:
/*
  const response: any = await fetch('http://localhost:3000/api/gtfs/lines/E');
  const testing = await response.json();
  const test = testing[0];

  const inbound: any = [
    {
      ...test.route,
      path: [...test.inbound]
    }
  ];

  const outbound: any = [
    {
      ...test.route,
      path: [...test.inbound],
    }
  ];
*/
  const response: any = await fetch('http://localhost:5000/api/v1/routes/');
  const data = await response.json();
  //console.log(data);
  let stations: any = [];
  let lines: any = [];

  data.forEach((route: any) => {
    if (route.trip) {
      stations = [
        ...stations,
        ...route.trip.stops.map((station: any) => {
          return {
            name: station.stopName,
            line: route.routeShortName,
            color: route.routeColor,
            coordinates: [
              station.stopLon,
              station.stopLat,
            ]
          }})
        ];

      lines.push([{
        line: route.routeId,
        color: route.routeColor,
        name: route.routeShortName,
        longName: route.routeLongName,
        description: route.routeDesc,
        path: route.trip.path,
      }])
    }
  });

  return {
    props: {
      stations,
      lines,
    },
  };
});

export default MapPage;
