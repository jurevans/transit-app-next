import { FC, ReactElement, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DateTime } from 'luxon';
import socketIOClient from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeStationDetails } from '../../../features/ui/mapStationDetails';
import { fetchServiceStatus } from '../../../features/realtime/statusSlice';
import { getIconPath } from '../../../helpers/map';
import { setTripUpdates } from '../../../features/realtime/tripUpdatesSlice';
import styles from '../../../styles/components/map/StationDetails.module.scss';
import { useSocket } from '../socket/SocketContext';

type Props = {
  data?: any;
};

const formatMin = (time: number, TZ: string) => {
  const now = DateTime.now().setZone(TZ).toSeconds();
  const minutes = (time - now) / 60;
  return minutes > 1 ? `${Math.round(minutes)} min` : 'Now';
};

const StationDetails: FC<Props> = (props: Props): ReactElement => {
  const { data } = props;
  const { data: statuses } = useAppSelector(state => state.realtime.status);
  const { agencyId, feedIndex, agencyTimezone } = useAppSelector(state => state.gtfs.agency);
  const { routeIds, stopTimeUpdates } = useAppSelector(state => state.realtime.tripUpdates);
  const dispatch = useAppDispatch();
  const { socket } = useSocket();

  // Re-fetch status data every minute
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchServiceStatus()),
      60000,
    );
    return () => clearTimeout(timer);
  });

  // TODO: Statuses will be replaced with real-time API (protobuf or json)
  const status = statuses.find((obj: any) => obj.name.search(data.properties.routes[0].name) !== -1);

  const handleClose = () => {
    dispatch(closeStationDetails());
  };

  useEffect(() => {
    if (data && data.hasOwnProperty('properties')) {
      const { id: stationId } = data.properties;
      // Get real-time updates:
      socket?.emit('trip_updates', { feedIndex, stationId }, (data: any) => console.log(data));
    }

    return () => {
      // Stop sending us updates:
      socket?.emit('cancel_trip_updates');
    };
  }, [data]);

  return (
    <div
      className={styles.details}
      onClick={e => e.stopPropagation()}
    >
      <div className={styles.icons}>
        {routeIds?.map((route: any) =>
          <Image
            key={route}
            src={getIconPath(agencyId, route)}
            alt={route}
            width={46}
            height={46} />
        )}
      </div>
      <div className="station-details-content">
        <p className={styles.name}>{data?.properties.name}</p>
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
            {stopTimeUpdates?.map((train: any, i: number) =>
              <li key={i} className={styles.train}>
                <Image
                    src={getIconPath(agencyId, train.routeId)}
                    alt={train.routeId}
                    width={30}
                    height={30} />
                <div className={styles.trainDetails}>
                  <div className={styles.headsign}>
                    {train.headsign}
                  </div>
                  <div className={styles.minutes}>
                    {formatMin(train.time, agencyTimezone)}
                  </div>
                </div>
              </li>
            )}
            </ul>
          </div>
        </div>
        <div>
          <p>Schedules:</p>
          {data?.properties.routes.map((station: any, i:number) =>
            station.url && <div key={i}><a href={station.url} target="_blank"><span>{station.routeId} Service Schedule &raquo;</span></a></div>)
          }
        </div>
        <div className={styles.buttons}>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StationDetails;
