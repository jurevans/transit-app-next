import React, { FC, ReactElement } from 'react';
import Image from 'next/image';
import styles from '../../../styles/components/map/Routes.module.scss';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { getIconPath } from '../../../helpers/map';
import { openRouteDetails } from '../../../features/ui/mapDetails';

const Routes: FC = (): ReactElement => {
  const routes = useAppSelector((state: any) => state.gtfs.routes);
  const { agencyId } = useAppSelector((state: any) => state.gtfs.agency);
  const { data: statusData } = useAppSelector((state: any) => state.realtime.status);
  const dispatch = useAppDispatch();

  const handleClick = (agencyId: string, routeId: any) => () => {
    dispatch(openRouteDetails({ agencyId, routeId }));
  };

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
    }
  });

  return (
    <div className={styles.routes}>
      <ul className={styles.routeslist}>
        {Object.keys(routes).map((key: string, i: number) =>
          <li key={i}>
            <Image
              src={getIconPath(agencyId, routes[key].routeId)}
              width={46}
              height={46}
              onClick={handleClick(agencyId, routes[key].routeId)}
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
                    onClick={handleClick(agencyId, route)}
                  />
                )}
              </div>
              <div className={styles.statusText}>
                {status.status}
              </div>
              <p className={styles.statusDateTime}>{status.time} {status.date}</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Routes;
