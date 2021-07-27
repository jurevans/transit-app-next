import { FC, ReactElement, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HTMLOverlay } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeStationDetails } from '../../../features/map/mapStationDetails';
import styles from '../../../styles/components/map/StationDetails.module.scss';
import { fetchServiceStatus } from '../../../features/api/statusApiSlice';
import { getIconPath } from '../../../helpers/map';

type Props = {
  data?: any;
}

const StationDetails: FC<Props> = (props: Props): ReactElement => {
  const {
    data,
  } = props;
  const { data: statuses } = useAppSelector(state => state.status);
  const { agencyId } = useAppSelector(state => state.agency);
  const dispatch = useAppDispatch();

  // Re-fetch status data every minute
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchServiceStatus()),
      60000,
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
          <p>Upcoming trains (TBD)</p>
          {/* TODO */}
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
