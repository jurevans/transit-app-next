import { ReactElement } from 'react';
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ServiceStatus from '../../ui/components/dashboard/ServiceStatus';
import { wrapper } from '../../app/store';
import { fetchServiceStatus } from '../../features/api/statusApiSlice';
import cities from '../../settings/cities';
import styles from '../../styles/pages/Dashboard.module.scss';
import { useAppSelector } from '../../app/hooks';

type Props = {
  city: string;
};

const DashboardPage: NextPage<Props> = (props: { city: string }): ReactElement => {
  const { city } = props;
  const cityConfig = cities.find(config => config.id === city);
  const { data: status } = useAppSelector(state => state.status);

  return (
    <div>
      <Head>
        <title>Transit App Next - Dashboard - {cityConfig?.label} - {cityConfig?.transitAuthority}</title>
        <meta name="description" content="Transit App - Dashboard" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Dashboard for {cityConfig?.label} - {cityConfig?.transitAuthority}
        </h1>
        <div>
          <div className={styles.grid}>
            <Link href={`/map/${cityConfig?.id}`}><a className={styles.card}>{cityConfig?.label} - {cityConfig?.transitAuthority} - Map</a></Link>
          </div>
        </div>
        {status && <ServiceStatus city={city} status={status} />}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {
  const cityId = params?.city;

  // Get service status for dashboard:
  await store.dispatch(fetchServiceStatus(cityId as string));
  const { city } = store.getState();

  return {
    props: {
      city: city.value,
    },
  };
});

export default DashboardPage;
