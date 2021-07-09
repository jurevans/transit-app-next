import { FC, ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SelectCity from '../ui/components/map/SelectCity';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updatedCity } from '../features/city/citySlice';
import { fetchStations } from '../features/api/stationsApiSlice';
import { fetchLines } from '../features/api/linesApiSlice';
import styles from '../styles/pages/Configure.module.scss';

const Dashboard: FC = (): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const dispatch = useAppDispatch();

  const handleSelectCity = (e: React.ChangeEvent<any>) => {
    const { value } = e.target;

    dispatch(fetchLines(value));
    dispatch(fetchStations(value));
    dispatch(updatedCity(value));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Transit App Next - Dashboard</title>
        <meta name="description" content="Transit App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          transit-app-next
        </h1>
        <div className={styles.grid}>
          <Link href="/map/"><a className={styles.card}>Map</a></Link>
        </div>
        <div className={styles.grid}>
          <SelectCity city={city} onChange={handleSelectCity} />
        </div>
      </main>

      <footer className={styles.footer}>
        &copy; ChangeMe
      </footer>
    </div>
  )
};

export default Dashboard;
