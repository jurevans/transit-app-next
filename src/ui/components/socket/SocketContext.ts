import { createContext, useContext } from 'react';
import { IState } from './SocketManager';

export const SocketContext = createContext({
  tripUpdates: {},
  alerts: {},
  vehiclePositions: {},
  socket: null,
} as IState);

export const useSocket = () => useContext(SocketContext);
