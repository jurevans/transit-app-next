import { FC, ReactElement } from 'react';
import settings from '../../../settings';
import styles from '../../../styles/components/map/SelectCity.module.scss';

type Props = {
  city: string;
  onChange: any;
};

const { cities } = settings;

const SelectCity: FC<Props> = (props: Props): ReactElement => {
  const {
    city,
    onChange,
  } = props;

  return (
    <select
      className={styles.select}
      value={city}
      onChange={onChange}>
      {cities.map((config: any) => (
        <option key={config.id} value={config.id}>{config.label}</option>
      ))}
    </select>
  )
};

export default SelectCity;