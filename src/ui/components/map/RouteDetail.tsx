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
      <div className={styles.status}>
        {/*status &&
          <span>
            <Link href={`/dashboard`}><strong>{status.status}</strong></Link>&nbsp;
            {status.date && <span>as of {status.date} {status.time}</span>}
        </span>*/}
      </div>
      <div>
        <a href={route.routeUrl} target="_blank">
          <span>{route.routeId} Service Schedule &raquo;</span>
        </a>
      </div>
    </div>
  );
};

export default RouteDetail;
