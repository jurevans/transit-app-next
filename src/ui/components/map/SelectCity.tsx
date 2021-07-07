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
      {Object.keys(cities).map((city: string) => (
        <option key={city} value={city}>{cities[city].label}</option>
      ))}
    </select>
  )
};

export default SelectCity;