import { FC, ReactElement, CSSProperties } from 'react';
import Image from 'next/image';
import { getIcons } from '../../../helpers/map';
import styles from '../../../styles/components/map/MapTooltip.module.scss';

type Props = {
  city: string;
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
  const { city, data } = props;
  // TODO: This isn't great, but will be removed when icon handling changes:
  const routes = data.routes || [{ routeId: data.line }];

  const icons = getIcons(city, routes).map((iconObj: any) =>
    <Image
      key={iconObj.line}
      src={iconObj.icon}
      alt={iconObj.line}
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