import React, { FC, ReactElement, useEffect } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { openRouteDetails } from '../../../features/ui/mapDetails';
import { useSocket } from '../socket/SocketContext';
import { getIconPath } from '../../../helpers/map';
import { formatMinUntil } from '../../../helpers/functions';
import styles from '../../../styles/components/map/StationDetails.module.scss';

type Props = {
  data?: any;
};

const StationDetails: FC<Props> = (props: Props): ReactElement => {
  const { data } = props;
  const { agencyId, feedIndex, agencyTimezone } = useAppSelector(state => state.gtfs.agency);
  const dispatch = useAppDispatch();
  const { socket, tripUpdates } = useSocket();
  const { routeIds, stopTimeUpdates = [] } = tripUpdates;

  useEffect(() => {
    if (data && data.hasOwnProperty('properties')) {
      const { id: stationId } = data.properties;
      // Get real-time updates:
      socket?.emit('trip_updates', { feedIndex, stationId });
    }
    return () => {
      // Stop sending updates:
      socket?.emit('cancel_trip_updates');
    };
  }, [data]);

  const handleClick = (agencyId: string, routeId: string) => (e: React.MouseEvent<any>) => {
    dispatch(openRouteDetails({ agencyId, routeId }));
  };

  return (
    <div
      className={styles.details}
    >
      <div className={styles.icons}>
        {routeIds?.map((route: any) =>
          <Image
            key={route}
            src={getIconPath(agencyId, route)}
            alt={route}
            width={46}
            height={46}
            onClick={handleClick(agencyId, route)}
          />
        )}
      </div>
      <div className="station-details-content">
        <p className={styles.name}>{data?.properties.name}</p>
        {stopTimeUpdates.length > 0
          ? <div className={styles.upcoming}>
              <p>Upcoming trains</p>
              <div className={styles.trainsContainer}>
                <ul className={styles.trains}>
                {stopTimeUpdates?.map((train: any, i: number) =>
                  <li key={i} className={styles.train}>
                    <Image
                      src={getIconPath(agencyId, train.routeId)}
                      alt={train.routeId}
                      width={30}
                      height={30}
                    />
                    <div className={styles.trainDetails}>
                      <div className={styles.headsign}>
                        {train.headsign}
                      </div>
                      <div className={styles.minutes}>
                        {formatMinUntil(train.time, agencyTimezone)}
                      </div>
                    </div>
                  </li>
                )}
                </ul>
              </div>
            </div>
          : <div className={styles.upcoming}>
              <p>No trains running at this station at this time</p>
            </div>
        }
      </div>
    </div>
  );
};

export default StationDetails;
