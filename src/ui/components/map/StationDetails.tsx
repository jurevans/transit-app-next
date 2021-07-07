import { FC, ReactElement } from 'react';
import Image from 'next/image';
import { HTMLOverlay } from 'react-map-gl';
import { useAppDispatch } from '../../../app/hooks';
import { closeStationDetails } from '../../../features/map/mapStationDetails';
import { getIcons } from '../../../helpers/map';
import styles from '../../../styles/components/map/StationDetails.module.scss';

type Props = {
  city: string;
  data?: any;
}

const StationDetails: FC<Props> = (props: Props): ReactElement => {
  const {
    city,
    data,
  } = props;

  const dispatch = useAppDispatch();

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
          getIcons(city, data.line).map(iconObj =>
            <Image key={iconObj.line} src={iconObj.icon} alt={iconObj.line} width={56} height={56} />
          )}
      </div>
      <div className="station-details-content">
        <p className={styles.name}>{data.name}</p>
        {data.notes && <p className={styles.notes}>{data.notes}</p>}
        <div className={styles.status}>
          <p>Upcoming trains (TBD)</p>
          {/* TODO */}
        </div>
        <div className={styles.buttons}>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );

  return (
    <HTMLOverlay
      captureDrag={true} // change to true once I figure out the height style issue
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
