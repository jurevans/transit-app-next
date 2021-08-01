import { FC, ReactElement, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HTMLOverlay } from 'react-map-gl';
import { DateTime } from 'luxon';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeStationDetails } from '../../../features/map/mapStationDetails';
import styles from '../../../styles/components/map/StationDetails.module.scss';
import { fetchServiceStatus } from '../../../features/api/statusApiSlice';
import { fetchGTFS } from '../../../features/gtfs/gtfsSlice';
import { getIconPath } from '../../../helpers/map';

type Props = {
  data?: any;
}

const StationDetails: FC<Props> = (props: Props): ReactElement => {
  const { data } = props;
  const { data: statuses } = useAppSelector(state => state.status);

  const { id: stationId } = data.properties;
  const { agencyId } = useAppSelector(state => state.agency);
  const transfers = useAppSelector(state => state.stations.transfers[stationId]);
  const { stops } = useAppSelector(state => state.stations);
  const { feedIndex } = useAppSelector(state => state.agency);
  const { data: realtimeData } = useAppSelector(state => state.gtfs);

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
    if (Object.keys(realtimeData).length > 0) {
      const realTime = stationIds.map((id: string) => realtimeData[id]);
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
  }, [transfers, realtimeData])

  const routes = useMemo(() => {
    const routes: any[] = [];
    stationIds.forEach((id: string) => {
      const station = realtimeData[id];
      const { routes: stationRoutes } = station;
      stationRoutes.forEach((route: string) => {
        if (routes.indexOf(route) < 0) {
          console.log('ADD ROUTE', route)
          routes.push(route);
        }
      })
    })
    return routes;
  }, [transfers, realtimeData])

  // Re-fetch status data every minute
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchServiceStatus()),
      60000,
    );
    return () => clearTimeout(timer);
  });

  // Re-fetch GTFS-realtime data every 30 seconds
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchGTFS(feedIndex, stationIds)),
      10000,
    );
    return () => clearTimeout(timer);
  });

  // TODO: Statuses will be replaced with real-time API (protobuf or json)
  const status = statuses.find((obj: any) => obj.name.search(data.properties.routes[0].name) !== -1);

  const handleClose = () => {
    dispatch(closeStationDetails());
  };

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
            width={56}
            height={56} />
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
