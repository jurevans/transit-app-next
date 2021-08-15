import { FC, ReactElement, useState, useEffect } from 'react';
import * as SocketIOClient from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { setTripUpdates } from '../../../features/realtime/tripUpdatesSlice';
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
  const [tripUpdates, setTripUpdatesState] = useState({});
  const [alerts, setAlertsState] = useState({});
  const [vehiclePositions, setVehiclePositionsState] = useState({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on('received_trip_updates', (payload: any) => {
      dispatch(setTripUpdates(payload));
      setTripUpdatesState(payload);
    });

    socket.on('received_alerts', (payload: any) => {
      setAlertsState(payload);
    });

    socket.on('received_vehicle_positions', (payload: any) => {
      setVehiclePositionsState(payload);
    });
    () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{
      tripUpdates,
      alerts,
      vehiclePositions,
      socket,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketManager;
