import { FC, ReactElement } from 'react';
import Routes from '../panel/Routes';
import RouteDetail from './RouteDetail';
import StationDetails from '../panel/StationDetails';
import { useAppSelector } from '../../../app/hooks';
import styles from '../../../styles/components/panel/Details.module.scss';

const Details: FC = (): ReactElement => {
  const {
    isRoutesOpen,
    isRouteDetailsOpen,
    isStationDetailsOpen,
    stationData,
  } = useAppSelector((state: any) => state.ui.stationDetails);
  const { agencyId, routeId } = useAppSelector((state: any) => state.ui.stationDetails.routeDetailsData)

  return (
    <div
      className={styles.details}
      onClick={e => e.stopPropagation()}
    >
      {isRoutesOpen && <Routes />}
      {isRouteDetailsOpen && <RouteDetail agencyId={agencyId} routeId={routeId} />}
      {isStationDetailsOpen && <StationDetails data={stationData} />}
    </div>
  );
};

export default Details;
