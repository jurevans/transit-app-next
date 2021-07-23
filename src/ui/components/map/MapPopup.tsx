import { FC, ReactElement } from 'react';
import { Popup } from 'react-map-gl';
import { closePopup } from '../../../features/map/mapPopupSlice';
import { openStationDetails } from '../../../features/map/mapStationDetails';
import { fetchServiceStatus } from '../../../features/api/statusApiSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Image from 'next/image';
import styles from '../../../styles/components/map/MapPopup.module.scss';

type Props = {
  data?: any;
}

const MapPopup:FC<Props> = (props: Props):ReactElement => {
  const { data } = props;
  const dispatch = useAppDispatch();
  const isStationDetailsOpen = useAppSelector(state => state.mapStationDetails.isOpen);
  const statuses = useAppSelector(state => state.status.data);
  const { agencyId } = useAppSelector(state => state.agency);

  const handleClose = () => {
    dispatch(closePopup());
  };

  const handleOpenDetails = () => {
    if (!isStationDetailsOpen) {
      dispatch(openStationDetails(data));
      if (statuses.length === 0) {
        dispatch(fetchServiceStatus());
      }
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
            data.routes.map((route: any) =>
              <Image
                key={route.routeId}
                layout="fixed"
                src={`/icons/${agencyId}/${route.routeId}.svg`}
                alt={route.routeId}
                width={36}
                height={36}
                priority={true}
              />
            )}
        </div>
        <div className={styles.content}>
          <p className={styles.name}>{data.name}</p>
          <ul className={styles.longNameList}>
            {data.routes.map((routeInfo: any, i: number) =>
              <li key={i} className={styles.longName}>{routeInfo.longName}</li>
            )}
          </ul>
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