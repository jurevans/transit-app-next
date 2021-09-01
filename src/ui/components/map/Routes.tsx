import React, { FC, ReactElement, useEffect, useMemo } from 'react';
import Image from 'next/image';
import styles from '../../../styles/components/map/Routes.module.scss';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { useSocket } from '../socket/SocketContext';
import { getIconPath } from '../../../helpers/map';
import { getSortedRoutes } from '../../../helpers/functions';
import { openRouteDetails } from '../../../features/ui/mapDetails';
import gtfsConfig, { ConfigItem } from '../../../../config/gtfs.config';
import { DateTime, Settings } from 'luxon';

const Routes: FC = (): ReactElement => {
  const routesObj = useAppSelector((state: any) => state.gtfs.routes);
  const { agencyId, feedIndex, agencyTimezone } = useAppSelector((state: any) => state.gtfs.agency);
  const dispatch = useAppDispatch();
  const { socket, alerts } = useSocket();
  const config = gtfsConfig.find((config: any) => config.feedIndex === feedIndex);
  const alertsForFeed = alerts[feedIndex];
  const { routeGroupings } = config as ConfigItem;
  const routes: any[] = useMemo(() => getSortedRoutes(routesObj), [routesObj]);

  // Set timezone for Luxon to match that of agency:
  Settings.defaultZoneName = agencyTimezone;

  const handleClick = (agencyId: string, routeId: any) => () => {
    dispatch(openRouteDetails({ agencyId, routeId }));
  };

  // Emit appropriate websocket messages:
  useEffect(() => {
    socket?.emit('alerts', { feedIndex });
    return () => {
      socket?.emit('cancel_alerts');
    };
  }, []);

  // TODO: Clean up this mess if possible:
  // The following takes a configuration describing how to group routes together,
  // along with all of the relevant alerts. If no configuration is present, simply
  // don't group:
  const alertRoutes = useMemo(() => {
    const alertRoutes: any[] = [];
    if (alertsForFeed) {
      if (routeGroupings && routeGroupings.length > 0) {
        routeGroupings.forEach((routeGroup: any) => {
          const alertsForGroup: any[] = [];
          routeGroup.forEach((routeId: string) => {
            const alertsInGroup = alertsForFeed[routeId]
            if (alertsInGroup) {
              alertsForGroup.push(...alertsInGroup);
            }
          });
          const goodService = alertsForGroup.every((alert: any) => alert === undefined);
          const routeAlerts = {
            routes: routeGroup.map((routeId: string) => routeId),
            alerts: [] as any[],
          };
          if (!goodService) {
            routeAlerts.alerts.push(...alertsForGroup)
          }
          alertRoutes.push({
            ...routeAlerts,
            goodService,
          });
        });
      } else {
        routes.forEach((route: any) => {
          const { routeId } = route;
          alertRoutes.push({
            routes: [routeId],
            alerts: alertsForFeed[routeId] ? alertsForFeed[routeId] : [],
            goodService: alertsForFeed[routeId] ? false : true,
          });
        });
      }
    }
    return alertRoutes;
  }, [alertsForFeed]);

  const makeAlerts = (alerts: any[]): ReactElement[] => {
    return alerts.map((alert: any, i: number) => {
      return <div key={i} className={styles.statusItemContainer}>
        <div className={styles.statusItem}>
          <span className={styles.statusText}>
            <span>{alert.headerText}</span>
          </span>
      </div>
      <div className={styles.statusDateTime}>
        {alert.activePeriod.start
          && DateTime.fromSeconds(alert.activePeriod.start).toLocaleString(DateTime.DATETIME_SHORT)}
        {(alert.activePeriod.end !== 0)
          && <>&nbsp;to {DateTime.fromSeconds(alert.activePeriod.end).toLocaleString(DateTime.DATETIME_SHORT)}</>}
      </div>
    </div>
    });
  };

  return (
    <div className={styles.routes}>
      <ul className={styles.routeslist}>
        {routes.map((route: any, i: number) =>
          <li key={i}>
            <Image
              src={getIconPath(agencyId, route.routeId)}
              width={46}
              height={46}
              onClick={handleClick(agencyId, route.routeId)}
            />
          </li>
        )}
      </ul>
      <div className={styles.statusContainer}>
        <ul className={styles.status}>
          {alertRoutes.map((alertRoute: any, i: number) =>
            <li className={styles.statusListItem} key={i}>
              <div className={styles.statusIcons}>
                {alertRoute.routes.map((routeId: any, j: number) =>
                  <Image
                      key={j}
                      src={getIconPath(agencyId, routeId)}
                      width={20}
                      height={20}
                      className={styles.statusIcon}
                    />
                  )}
              </div>
              <div className={styles.statusTextContainer}>
                {alertRoute.goodService
                  ? <span className={styles.statusText}>
                      Good service
                    </span>
                  : makeAlerts(alertRoute.alerts)
                }
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Routes;
