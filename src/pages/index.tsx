import { FC, ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCity } from '../features/city/citySlice';
import { fetchStations } from '../features/api/stationsApiSlice';
import { fetchLines } from '../features/api/linesApiSlice';
import styles from '../styles/pages/Configure.module.scss';
import cities from '../settings/cities';

const Dashboard: FC = (): ReactElement => {
  const city = useAppSelector(state => state.city.value);
  const dispatch = useAppDispatch();

  const handleSelectCity = (e: React.ChangeEvent<any>) => {
    const { value } = e.target;

    dispatch(fetchLines(value));
    dispatch(fetchStations(value));
    dispatch(setCity(value));
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
          <h4>Available maps:</h4>
        </div>
        <div className={styles.grid}>
          {cities.map(config =>
            <Link key={config.id} href={`/map/${config.id}`}><a className={styles.card}>{config.label} -{config.transitAuthority}</a></Link>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        &copy; ChangeMe
      </footer>
    </div>
  )
};

export default Dashboard;
