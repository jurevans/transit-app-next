import { FC, ReactElement } from 'react';
import Routes from './Routes';
import RouteDetail from './RouteDetail';
import StationDetails from './StationDetails';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import styles from '../../../styles/components/map/Details.module.scss';
import { useEffect } from 'react';
import { fetchServiceStatus } from '../../../features/realtime/statusSlice';

const Details: FC = (): ReactElement => {
  const {
    isRoutesOpen,
    isRouteDetailsOpen,
    isStationDetailsOpen,
    stationData,
  } = useAppSelector((state: any) => state.ui.stationDetails);
  const { agencyId, routeId } = useAppSelector((state: any) => state.ui.stationDetails.routeDetailsData)
  const dispatch = useAppDispatch();

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
