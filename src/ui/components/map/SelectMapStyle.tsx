import React, { FC, ReactElement } from 'react';
import { HTMLOverlay } from 'react-map-gl';
import settings from 'src/settings';
import { MapStylesItem } from 'src/settings/mapStyles';
import styles from 'src/styles/components/map/SelectMapStyle.module.scss';

type Props = {
  mapStyle: MapStylesItem;
  onChange: any;
};

const { mapStyles } = settings;

const SelectMapStyle: FC<Props> = (props: Props): ReactElement => {
  const {
    mapStyle,
    onChange,
  } = props;

  const redraw = () => (
    <select
      className={styles.select}
      value={mapStyle.value}
      onChange={onChange}
    >
      {mapStyles.map((style: MapStylesItem) => (
        <option key={style.id} value={style.value}>{style.label}</option>
      ))}
    </select>
  );

  return (
    <HTMLOverlay
      captureDrag={true} // change to true once I figure out the height style issue
      captureScroll={true}
      captureClick={true}
      captureDoubleClick={true}
      capturePointerMove={true}
      redraw={redraw}
      style={{ top: null, width: 100, height: 30, bottom: 35, left: 10 }}
    />
  );
};

export default SelectMapStyle;
