import { FC, ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/pages/Configure.module.scss';

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
        <div className={styles.grid}>
          <Link href={'/dashboard/nyc'}><a className={styles.card}>MTA - Dashboard</a></Link>
          <Link href={'/map/nyc'}><a className={styles.card}>MTA - Map</a></Link>
        </div>
      </main>

      <footer className={styles.footer}>
        &copy; ChangeMe
      </footer>
    </div>
  )
};

export default Home;
