import { ReactElement } from 'react';
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { wrapper } from '../../app/store';
import { setCity } from '../../features/city/citySlice';
import cities from '../../settings/cities';
import styles from '../../styles/pages/Dashboard.module.scss';

type Props = {
  city: string;
};

const DashboardPage: NextPage<Props> = (props: { city: string }): ReactElement => {
  const { city } = props;
  const cityConfig = cities.find(config => config.id === city);

  return (
    <div>
      <Head>
        <title>Transit App Next - Dashboard - {cityConfig?.label} - {cityConfig?.transitAuthority}</title>
        <meta name="description" content="Transit App - Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Dashboard for {cityConfig?.label} - {cityConfig?.transitAuthority}
        </h1>
        <div>
        <div key={cityConfig?.id} className={styles.grid}>
          <Link href={`/map/${cityConfig?.id}`}><a className={styles.card}>{cityConfig?.label} - {cityConfig?.transitAuthority} - Map</a></Link>
        </div>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {
  const cityId = params?.city;

  await store.dispatch(setCity(cityId as string));
  const { city } = store.getState();

  return {
    props: {
      city: city.value,
    },
  };
});

export default DashboardPage;