import { ReactElement } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ServiceStatus from '../../ui/components/dashboard/ServiceStatus';
import { wrapper } from '../../app/store';
import { fetchServiceStatus } from '../../features/realtime/statusSlice';
import styles from '../../styles/pages/Dashboard.module.scss';
import { useAppSelector } from '../../app/hooks';
import { setAgency } from '../../features/gtfs/agencySlice';
import { API_URL } from '../../../config/api.config';

type Props = {
  status: any;
};

const DashboardPage: NextPage<Props> = (props: Props): ReactElement => {

  const { status } = props;
  const { agencyId, agencyName } = useAppSelector(state => state.gtfs.agency);

  return (
    <div>
      <Head>
        <title>Transit App Next - Dashboard</title>
        <meta name='description' content='Transit App - Dashboard' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Dashboard for {agencyName}
        </h1>
        <div>
          <div className={styles.grid}>
            <Link href={'/map'}><a className={styles.card}>{agencyId} - Map</a></Link>
          </div>
        </div>
        {status && <ServiceStatus status={status} />}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async () => {

  // Fetch feeds:
  const feedResponse = await fetch(`${API_URL}/api/feed`);
  const feed = await feedResponse.json();
  // In the future, there may be a configuration option to select which feed to load,
  // identified by associated agency. For now, load the first one:
  const { feedIndex, agencyId } = feed[0];

  // Fetch agency:
  const agencyResponse = await fetch(`${API_URL}/api/agency/${agencyId}?feedIndex=${feedIndex}`);
  const agency = await agencyResponse.json();

  // Fetch location data for feed:
  const locationResponse = await fetch(`${API_URL}/api/location/${feedIndex}`);
  const location: any = await locationResponse.json();

  await store.dispatch(setAgency({
    ...agency,
    location,
  }));

  // Get service status for dashboard:
  await store.dispatch(fetchServiceStatus());
  const { status } = store.getState().realtime;

  return {
    props: {
      status,
    },
  };
});

export default DashboardPage;
