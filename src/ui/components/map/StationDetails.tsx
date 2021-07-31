import { FC, ReactElement, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HTMLOverlay } from 'react-map-gl';
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

  let useTrains: any[] = [];

  useMemo(() => {
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
      }, [])

      const trainsWithHeadsigns = trains.map((train: any) => ({
        ...train,
        headsign: stopsForStation[train.stopId].headsign,
      })).sort((a: any, b: any) => a.time - b.time);
      console.log('TRAINS?', trains, trainsWithHeadsigns);
      useTrains = trainsWithHeadsigns;
    }
  }, [realtimeData])

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
      30000,
    );
    return () => clearTimeout(timer);
  });

  // TODO: This can be improved, perhaps displayed for each relevant line:
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
        {data.properties.routes.map((route: any) =>
          <Image
            key={route.routeId}
            src={getIconPath(agencyId, route.routeId)}
            alt={route.routeId}
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
            {useTrains.map((train: any, i: number) =>
              <li key={i}>
                <Image
                  src={getIconPath(agencyId, train.route)}
                  alt={train.route}
                  width={20}
                  height={20} />
                <span>
                  {train.headsign}
                </span>
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
