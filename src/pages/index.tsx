import { FC, ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/pages/Configure.module.scss';
import cities from '../settings/cities';

const Home: FC = (): ReactElement => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Transit App Next - Home</title>
        <meta name="description" content="Transit App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          transit-app-next
        </h1>
        <div className={styles.grid}>
          <h4>Available cities:</h4>
        </div>
        {cities.map(config =>
          <div key={config.id} className={styles.grid}>
            <Link href={`/dashboard/${config.id}`}><a className={styles.card}>{config.label} - Dashboard</a></Link>
            <Link href={`/map/${config.id}`}><a className={styles.card}>{config.label} - Map</a></Link>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        &copy; ChangeMe
      </footer>
    </div>
  )
};

export default Home;
