import React, { FC, ReactElement, useMemo } from 'react';
import Image from 'next/image';
import styles from '../../../styles/components/map/Routes.module.scss';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { getIconPath } from '../../../helpers/map';
import { getSortedRoutes } from '../../../helpers/functions';
import { openRouteDetails } from '../../../features/ui/mapDetails';

const Routes: FC = (): ReactElement => {
  const routesObj = useAppSelector((state: any) => state.gtfs.routes);
  const { agencyId } = useAppSelector((state: any) => state.gtfs.agency);
  const { data: statusData } = useAppSelector((state: any) => state.realtime.status);
  const dispatch = useAppDispatch();

  const handleClick = (agencyId: string, routeId: any) => () => {
    dispatch(openRouteDetails({ agencyId, routeId }));
  };

  // TODO: The following will be removed when Alerts are
  // properly implemented:
  const statuses = statusData.map((status: any) => {
    const { name } = status;
    const routes = [];
    switch(name) {
      case 'SIR':
        routes.push('SI');
        break;
      case 'S':
        routes.push('GS');
        break;
      default:
        routes.push(...name.split(''));
    }
    return {
      routes,
      ...status,
    };
  });

  const routes: any[] = useMemo(() => getSortedRoutes(routesObj), [routesObj]);

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
          {statuses.map((status: any, i: number) =>
            <li className={styles.statusListItem} key={i}>
              <div className={styles.statusIcons}>
                {status.routes.map((route: any, j: number) => 
                  <Image
                    key={j}
                    src={getIconPath(agencyId, route)}
                    width={20}
                    height={20}
                    className={styles.statusIcon}
                  />
                )}
              </div>
              <div className={styles.statusTextContainer}>
                <span className={styles.statusText}>{status.status}</span>
                <span className={styles.statusDateTime}>{status.time} {status.date}</span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Routes;
