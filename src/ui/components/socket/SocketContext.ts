import { createContext, useContext } from 'react';
import * as SocketIOClient from 'socket.io-client';

type ISocketContext = {
  tripUpdates: any;
  alerts: any;
  vehiclePositions: any;
  socket: SocketIOClient.Socket | null;
};

export const SocketContext = createContext<ISocketContext>({
  tripUpdates: {},
  alerts: {},
  vehiclePositions: {},
  socket: null,
});

export const useSocket = () => useContext(SocketContext);
