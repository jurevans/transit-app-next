import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HTMLOverlay } from 'react-map-gl';
import { DateTime } from 'luxon';
import socketIOClient from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeStationDetails } from '../../../features/ui/mapStationDetails';
import styles from '../../../styles/components/map/StationDetails.module.scss';
import { fetchServiceStatus } from '../../../features/realtime/statusSlice';
import { fetchTripUpdates } from '../../../features/realtime/tripUpdatesSlice';
import { getIconPath } from '../../../helpers/map';

type Props = {
  data?: any;
};

const StationDetails: FC<Props> = (props: Props): ReactElement => {
  const { data } = props;
  const { data: statuses } = useAppSelector(state => state.realtime.status);

  const { id: stationId } = data.properties;
  const { agencyId, feedIndex } = useAppSelector(state => state.gtfs.agency);
  const transfers = useAppSelector(state => state.gtfs.stations.transfers[stationId]);
  const { stops } = useAppSelector(state => state.gtfs.stations);
  const tripUpdates = useAppSelector(state => state.realtime.tripUpdates);

  const dispatch = useAppDispatch();

  // All station IDs
  const stationIds = transfers
    ? transfers.map((transfer: any) => transfer.stopId)
    : [stationId];

  // Index all available stops for this station:
  const stopsForStation = stops
    .filter((stop: any) => stationIds.indexOf(stop.stopId) > -1)
    .reduce((obj: any, stop: any) => {
      for (const stopId in stop.stops) {
        obj[stopId] = stop.stops[stopId];
      }
      return obj;
    }, {});

  const trains = useMemo(() => {
    if (Object.keys(tripUpdates).length > 0) {
      const realTime = stationIds.map((id: string) => tripUpdates[id]);
      // Get all trains for available stops:
      const trains = realTime.reduce((trains: any, station: any) => {
        if (station) {
          trains = [
            ...trains,
            ...station.trains,
          ];
        }
        return trains;
      }, []).sort((a: any, b: any) => a.time - b.time);

      const now = DateTime.now().toSeconds();
      const trainsWithHeadsigns = trains.map((train: any) => {
        const minutes = (train.time - now) / 60;
        const formattedMin = minutes > 1 ? `${Math.round(minutes)} min` : 'Now';

        return {
          ...train,
          minutes,
          formattedMin,
          headsign: stopsForStation[train.stopId].headsign,
        };
      });
      return trainsWithHeadsigns;
    }
    return [];
  }, [transfers, tripUpdates]);

  const routes = useMemo(() => {
    const routes: any[] = [];
    stationIds.forEach((id: string) => {
      const station = tripUpdates[id];
      const stationRoutes = station ? station.routes : [];
      stationRoutes.forEach((route: string) => {
        if (routes.indexOf(route) < 0) {
          routes.push(route);
        }
      })
    })
    return routes;
  }, [transfers, tripUpdates]);

  // Re-fetch status data every minute
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchServiceStatus()),
      60000,
    );
    return () => clearTimeout(timer);
  });

  // Re-fetch GTFS-realtime data every 10 seconds
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchTripUpdates(feedIndex, stationIds)),
      10000,
    );
    return () => clearTimeout(timer);
  });

  // TODO: Statuses will be replaced with real-time API (protobuf or json)
  const status = statuses.find((obj: any) => obj.name.search(data.properties.routes[0].name) !== -1);

  const handleClose = () => {
    dispatch(closeStationDetails());
  };

  const [response, setResponse] = useState([]);
  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000');
    socket.on('recieved_trip_updates', (data: any) => {
       console.log('recieved_trip_updates', data);
       setResponse(data);
    });

    if (data && data.hasOwnProperty('properties')) {
      const { id: stationId, routes } = data.properties;
      const routeIds = routes.map((route: any) => route.routeId);
      socket.emit('trip_updates', { feedIndex, stationId, routeIds }, (data: any) => console.log(data));
    }

    return () => {
      socket.disconnect();
    };
  }, [data]);

  const redraw = () => (
    <div
      className={styles.details}
      onClick={e => e.stopPropagation()}
    >
      <div className={styles.icons}>
        {routes.map((route: any) =>
          <Image
            key={route}
            src={getIconPath(agencyId, route)}
            alt={route}
            width={46}
            height={46} />
        )}
      </div>
      <div className="station-details-content">
        <p className={styles.name}>{data.properties.name}</p>
        <div className={styles.status}>
          {status &&
            <span>
              <Link href={`/dashboard`}><strong>{status.status}</strong></Link>&nbsp;
              {status.date && <span>as of {status.date} {status.time}</span>}
            </span>}
        </div>
        <div className={styles.upcoming}>
          <p>Upcoming trains</p>
          <div className={styles.trainsContainer}>
            <ul className={styles.trains}>
            {trains.map((train: any, i: number) =>
              <li key={i} className={styles.train}>
                <Image
                    src={getIconPath(agencyId, train.route)}
                    alt={train.route}
                    width={30}
                    height={30} />
                <div className={styles.trainDetails}>
                  <div className={styles.headsign}>
                    {train.headsign}
                  </div>
                  <div className={styles.minutes}>
                    {train.formattedMin}
                  </div>
                </div>
              </li>
            )}
            </ul>
          </div>
        </div>
        <div>
          <p>Schedules:</p>
          {data.properties.routes.map((station: any, i:number) =>
            station.url && <div key={i}><a href={station.url} target="_blank"><span>{station.routeId} Service Schedule &raquo;</span></a></div>)
          }
        </div>
        
        <div className={styles.buttons}>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );

  return (
    <HTMLOverlay
      captureDrag={true}
      captureScroll={true}
      captureClick={true}
      captureDoubleClick={true}
      capturePointerMove={true}
      redraw={redraw}
      style={{ top: 10, width: 300, height: '50%', left: 10 }}
    />
  );
};

export default StationDetails;
