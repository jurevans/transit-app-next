import { FC, ReactElement } from 'react';
import { Popup } from 'react-map-gl';
import Image from 'next/image';
import { closePopup } from '../../../features/ui/mapPopupSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getIconPath } from '../../../helpers/map';
import styles from '../../../styles/components/map/MapPopup.module.scss';

type Props = {
  data?: any;
}

const MapPopup:FC<Props> = (props: Props):ReactElement => {
  const { data } = props;
  const dispatch = useAppDispatch();
  const { agencyId } = useAppSelector(state => state.gtfs.agency);

  const handleClose = () => {
    dispatch(closePopup());
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
          {data.properties.routes.map((route: any) =>
            <Image
              key={route.routeId}
              layout="fixed"
              src={getIconPath(agencyId, route.routeId)}
              alt={route.routeId}
              width={36}
              height={36}
              priority={true}
            />
          )}
        </div>
        <div className={styles.content}>
          <p className={styles.name}>{data.properties.name}</p>
          <div className={styles.buttons}>
            <button className={styles.close} onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default MapPopup;
