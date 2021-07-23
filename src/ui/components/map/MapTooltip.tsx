import { FC, ReactElement, CSSProperties } from 'react';
import Image from 'next/image';
import styles from '../../../styles/components/map/MapTooltip.module.scss';
import { useAppSelector } from '../../../app/hooks';

type Props = {
  data: any; // TODO: We need a type here.
};

const computedStyles: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  pointerEvents: 'none',
};

const getStyles = (x: number, y: number): CSSProperties => {
  return ({
    ...computedStyles,
    left: x,
    top: y,
  });
};

const MapTooltip: FC<Props> = (props: Props): ReactElement => {
  const { data } = props;
  const { agencyId } = useAppSelector(state => state.agency);
  const routes = data.routes || [{ routeId: data.line }];

  const icons = routes.map((route: any) =>
    <Image
      key={route.routeId}
      src={`/icons/${agencyId}/${route.routeId}.svg`}
      alt={route.routeId}
      width={25}
      height={25}
    />
  );

  if (data.isStation) {
    return (
      <div
        className={styles.station}
        style={{ ...getStyles(data.x, data.y) }}
      >
        <div className={styles.icons}>
          {icons}
        </div>
        <p className={styles.name}>{data.name}</p>
      </div>
    );
  } else {
    return (
      <div
        className={styles.tooltip}
        style={{ ...getStyles(data.x, data.y-40) }}
      >
        <div className={styles.icons}>
          {icons}
        </div>
        <div>
          {data.longName || data.name}
        </div>
      </div>
    );
  }
};

export default MapTooltip;