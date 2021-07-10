import { FC, ReactElement } from 'react';
import { Popup } from 'react-map-gl';
import { closePopup } from '../../../features/map/mapPopupSlice';
import { openStationDetails } from '../../../features/map/mapStationDetails';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getIcons } from '../../../helpers/map';
import Image from 'next/image';
import styles from '../../../styles/components/map/MapPopup.module.scss';

type Props = {
  city: string;
  data?: any;
}

const MapPopup:FC<Props> = (props: Props):ReactElement => {
  const { city, data } = props;
  const dispatch = useAppDispatch();
  const isStationDetailsOpen = useAppSelector(state => state.mapStationDetails.isOpen);

  const handleClose = () => {
    dispatch(closePopup());
  };

  const handleOpenDetails = () => {
    if (!isStationDetailsOpen) {
      dispatch(openStationDetails(data));
    }
  };

  return (data &&
    <Popup
      longitude={data.coordinates[0]}
      latitude={data.coordinates[1]}
      closeOnClick={false}
      onClose={handleClose}
    >
      <div
        className={styles.popup}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.icons}>
          {data.line &&
            getIcons(city, data.line).map((iconObj: any) =>
              <Image
                key={iconObj.line}
                layout="fixed"
                src={iconObj.icon}
                alt={iconObj.line}
                width={36}
                height={36}
                priority={true}
              />
            )}
        </div>
        <div className={styles.content}>
          <p className={styles.name}>{data.name}</p>
          {data.notes && <p className={styles.notes}>{data.notes}</p>}
          <div className={styles.buttons}>
            <button onClick={handleOpenDetails}>Status</button>
            <button className={styles.close} onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </Popup>
  )
};

export default MapPopup;