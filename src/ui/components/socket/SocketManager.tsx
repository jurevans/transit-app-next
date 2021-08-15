import { Component, ComponentType } from 'react';
import { connect } from 'react-redux';
import * as SocketIOClient from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { setTripUpdates } from '../../../features/realtime/tripUpdatesSlice';
const { gtfsApiUrl = 'http://localhost:3000' } = process.env;

type Props = {
  children: any;
  setTripUpdates: any;
};

export type IState = {
  tripUpdates: any;
  alerts: any;
  vehiclePositions: any;
  socket: SocketIOClient.Socket | null;
};

export class WrappedSocketManager extends Component<Props> {
  state: IState = {
    tripUpdates: {},
    alerts: {},
    vehiclePositions: {},
    socket: null,
  };
  socket: SocketIOClient.Socket | null = null;

  constructor(props: Props) {
    super(props);

    this.socket = SocketIOClient.io(gtfsApiUrl, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      secure: true,
    });
  
    this.socket.on('received_trip_updates', (payload: any) => {
      this.props.setTripUpdates(payload);
      this.setState({
        tripUpdates: payload,
      });
    });

    this.socket.on('received_alerts', (payload: any) => {
      this.setState({
        alerts: payload.alerts,
      });
    });

    this.socket.on('received_vehicle_positions', (payload: any) => {
      this.setState({
        vehiclePositions: payload.vehiclePositions,
      });
    });
  }

  componentWillUnmount () {
    try {
      this.socket !== null && this.socket.disconnect();
    } catch (e) {
      // socket not connected
    }
  }

  render() {
    const { tripUpdates, alerts, vehiclePositions } = this.state;
    const { children } = this.props;

    return (
      <SocketContext.Provider value={{
        tripUpdates,
        alerts,
        vehiclePositions,
        socket: this.socket,
      }}>
        {children}
      </SocketContext.Provider>
    );
  }
}

const mapDispatchToProps =  {
  setTripUpdates,
};

export const SocketManager = connect(
  null,
  mapDispatchToProps)(WrappedSocketManager);

export default SocketManager;
