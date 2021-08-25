import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Alert = {};

type AlertsState = {
  [key: string]: Alert[];
};

type AlertsPayload = {
  feedIndex: number;
  alerts: Alert[];
}

const initialState: AlertsState = {};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts(state, action: PayloadAction<AlertsPayload>) {
      const { feedIndex, alerts } = action.payload;
      state[feedIndex] = alerts;
    },
  },
});

export const { setAlerts: setAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
