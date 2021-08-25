import { FC, ReactElement, useState, useEffect } from 'react';
import * as SocketIOClient from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { setTripUpdates } from '../../../features/realtime/tripUpdatesSlice';
import { setAlerts } from '../../../features/realtime/alertsSlice';
import { useAppDispatch } from '../../../app/hooks';

type Props = {
  children: any;
};

const { gtfsApiUrl = 'http://localhost:3000' } = process.env;
const socket = SocketIOClient.io(gtfsApiUrl, {
  transports: ['websocket'],
  rejectUnauthorized: false,
  secure: true,
});

const SocketManager: FC<Props> = (props: Props): ReactElement => {
  const { children } = props;
  const [tripUpdatesState, setTripUpdatesState] = useState({});
  const [alertsState, setAlertsState] = useState({});
  const [vehiclePositionsState, setVehiclePositionsState] = useState({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on('received_trip_updates', (payload: any) => {
      const {
        feedIndex,
        stationId,
        transfers,
        routeIds,
        stopTimeUpdates,
      } = payload;

      dispatch(setTripUpdates(payload));
      setTripUpdatesState({
        ...tripUpdatesState,
        [feedIndex]: {
          stationId,
          transfers,
          routeIds,
          stopTimeUpdates,
        }
      });
    });

    socket.on('received_alerts', (payload: any) => {
      dispatch(setAlerts(payload));
      const { feedIndex, alerts } = payload;
      setAlertsState({
        ...alertsState,
        [feedIndex]: alerts,
      });
    });

    socket.on('received_vehicle_positions', (payload: any) => {
      const { feedIndex, vehiclePositions } = payload;
      setVehiclePositionsState({
        ...vehiclePositionsState,
        [feedIndex]: vehiclePositions,
      });
    });
    () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{
      tripUpdates: tripUpdatesState,
      alerts: alertsState,
      vehiclePositions: vehiclePositionsState,
      socket,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketManager;
