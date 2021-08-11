import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppThunk } from '../../app/store';
import { API_URL } from '../../../config/api.config';

export const fetchServiceStatus = (): AppThunk => async dispatch => {
  const response = await fetch(`${API_URL}/api/status/`);
  const status = await response.json();

  dispatch(statusApiSlice.actions.setStatus(status));
};

export interface StatusState {
  data: any[],
};

const initialState: StatusState = {
  data: [],
};

const statusApiSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    }
  },
  extraReducers: {
    [HYDRATE] : (state, action: any) => {
      return {
        ...state,
        ...action.payload.realtime.status.data,
      };
    },
  },
});

export const { setStatus } = statusApiSlice.actions;
export default statusApiSlice.reducer;
