import { FC, ReactElement, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HTMLOverlay } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeStationDetails } from '../../../features/map/mapStationDetails';
import { getIcons } from '../../../helpers/map';
import styles from '../../../styles/components/map/StationDetails.module.scss';
import { fetchServiceStatus } from '../../../features/api/statusApiSlice';

type Props = {
  city: string;
  data?: any;
}

const StationDetails: FC<Props> = (props: Props): ReactElement => {
  const {
    city,
    data,
  } = props;
  const { data: statuses } = useAppSelector(state => state.status);
  const dispatch = useAppDispatch();

  // Re-fetch status data every minute
  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(fetchServiceStatus(city)),
      60000,
    );
    return () => clearTimeout(timer);
  });

  const status = statuses.find((obj: any) => obj.name.search(data.line.split('-')[0]) !== -1);

  const handleClose = () => {
    dispatch(closeStationDetails());
  };

  const redraw = () => (
    <div
      className={styles.details}
      onClick={e => e.stopPropagation()}
    >
      <div className={styles.icons}>
        {data.line &&
          getIcons(data.routes).map((iconObj: any) =>
            <Image key={iconObj.line} src={iconObj.icon} alt={iconObj.line} width={56} height={56} />
          )}
      </div>
      <div className="station-details-content">
        <p className={styles.name}>{data.name}</p>
        {data.notes && <p className={styles.notes}>{data.notes}</p>}
        <div className={styles.status}>
          {status &&
            <span>
              <Link href={`/dashboard/${city}`}><strong>{status.status}</strong></Link>&nbsp;
              {status.date && <span>as of {status.date} {status.time}</span>}
            </span>}
        </div>
        <div className={styles.upcoming}>
          <p>Upcoming trains (TBD)</p>
          {/* TODO */}
        </div>
        <div>
          {data.routes.map((station: any, i:number) =>
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
