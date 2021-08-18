import React, { FC, ReactElement, useEffect } from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { useSocket } from '../socket/SocketContext';
import { openRoutes } from '../../../features/ui/mapDetails';
import { getIconPath } from '../../../helpers/map';
import styles from '../../../styles/components/map/RouteDetail.module.scss';
import { DateTime, Settings } from 'luxon';

type Props = {
  agencyId: string;
  routeId: string;
};

const RouteDetail: FC<Props> = (props: Props): ReactElement => {
  const { agencyId, routeId } = props;
  const route: any = useAppSelector(state => state.gtfs.routes[routeId]);
  const { feedIndex, agencyTimezone } = useAppSelector((state: any) => state.gtfs.agency);
  const dispatch = useAppDispatch();
  const { socket, alerts } = useSocket();
  const alertsForRoute = alerts[feedIndex][routeId];

  // Set timezone for Luxon to match that of agency:
  Settings.defaultZoneName = agencyTimezone;

  const handleClick = () => {
    dispatch(openRoutes());
  };

  // Emit appropriate websocket messages:
  useEffect(() => {
    socket?.emit('alerts', { feedIndex });
    return () => {
      socket?.emit('cancel_alerts');
    };
  }, []);

  const stripTags = (text: string) => {
    return text.replace(/(<([^>]+)>)/gi, '');
  };

  return (
    <div className={styles.routes}>
      <div className={styles.heading}>
        <Image
          src={getIconPath(agencyId, routeId)}
          width={56}
          height={56}
          onClick={handleClick}
        />
        <h3>{route.routeLongName}</h3>
      </div>
      <div className={styles.description}>
        <p>{route.routeDesc}</p>
      </div>
      <div className={styles.timetable}>
        <a href={route.routeUrl} target="_blank">
          <span className={styles.routeServiceSchedule}>
            <Image
              src={getIconPath(agencyId, routeId)}
              width={25}
              height={25}
              onClick={handleClick}
            />
            &nbsp;Subway Timetable (PDF) &raquo;
          </span>
        </a>
      </div>
      <div className={styles.alerts}>
        {alertsForRoute
          ? alertsForRoute.map((alert: any, i: number) => (
              <div key={i} className={styles.alert}>
                <div className={styles.alertHeader}>{alert.headerText}</div>
                <div className={styles.alertDescription}>{stripTags(alert.descriptionText)}</div>
                <div className={styles.alertDateTime}>
                  {alert.activePeriod.start
                    && DateTime.fromSeconds(alert.activePeriod.start).toLocaleString(DateTime.DATETIME_SHORT)}
                  {(alert.activePeriod.end !== 0)
                    && <span>&nbsp;to {DateTime.fromSeconds(alert.activePeriod.end).toLocaleString(DateTime.DATETIME_SHORT)}</span>}
                </div>
              </div>
            ))
          : <div className={styles.alert}>
              <div className={styles.alertHeader}>
                Good service
              </div>
            </div>}
      </div>
    </div>
  );
};

export default RouteDetail;
