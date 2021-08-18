import React, { FC, ReactElement } from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { openRoutes } from '../../../features/ui/mapDetails';
import { getIconPath } from '../../../helpers/map';
import styles from '../../../styles/components/map/RouteDetail.module.scss';

type Props = {
  agencyId: string;
  routeId: string;
};

const RouteDetail: FC<Props> = (props: Props): ReactElement => {
  const { agencyId, routeId } = props;
  const route: any = useAppSelector(state => state.gtfs.routes[routeId]);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(openRoutes());
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
      <div>
        <p>{route.routeDesc}</p>
      </div>
      <div>
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
    </div>
  );
};

export default RouteDetail;
