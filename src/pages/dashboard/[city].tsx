import { ReactElement } from 'react';
import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { wrapper } from '../../app/store';
import { setCity } from '../../features/city/citySlice';
import cities from '../../settings/cities';
import styles from '../../styles/pages/Dashboard.module.scss';
import { getIcons } from '../../helpers/map';

type Props = {
  city: string;
  serviceStatus: any;
};

const DashboardPage: NextPage<Props> = (props: { city: string, serviceStatus: any }): ReactElement => {
  const { city, serviceStatus } = props;
  const cityConfig = cities.find(config => config.id === city);

  let lineStatuses = [];
  let icons: any[] = [];

  if (serviceStatus) {
    const { subway } = serviceStatus?.service;
    lineStatuses = subway[0].line;

    icons = lineStatuses.map((status: any) => {
      const originalName = status.name[0];
      if (originalName === 'SIR') {
        return getIcons(city, originalName);
      } else {
        return getIcons(city, originalName.split('').join('-'));
      }
    });
  }

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
          <div className={styles.grid}>
            <Link href={`/map/${cityConfig?.id}`}><a className={styles.card}>{cityConfig?.label} - {cityConfig?.transitAuthority} - Map</a></Link>
          </div>
        </div>
        <div className="service-status">
          {lineStatuses.map((status: any, i: number) => (
            <div key={i}>
              {icons[i].map((icon: any, j: number) =>
                <Image key={j} src={icon.icon} width={25} height={25} alt={icon.line} />
              )}
              <div dangerouslySetInnerHTML={{ __html: status.text }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ params }: GetServerSidePropsContext) => {
  const cityId = params?.city;
  const config = cities.find(config => config.id === cityId);
  let serviceStatus = null;

  if (config?.settings.serviceStatusEndpoint) {
    // Get service status for dashboard:
    const response = await fetch(`http://localhost:3000/api/status/${cityId}`);
    serviceStatus = await response.json();
  }

  await store.dispatch(setCity(cityId as string));
  const { city } = store.getState();

  return {
    props: {
      city: city.value,
      serviceStatus,
    },
  };
});

export default DashboardPage;
