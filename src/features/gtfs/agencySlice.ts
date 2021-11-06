import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface Agency {
  feedIndex: number;
  agencyId: string;
  agencyName: string;
  agencyUrl: string;
  agencyTimezone: string;
  agencyLang: string;
  agencyPhone: string;
  location: {
    longitude: number;
    latitude: number;
  };
}

type AgencyState = Agency | any;

const initialState: AgencyState = {};

const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    setAgency(state: any, action: PayloadAction<Agency>) {
      const agency = action.payload;
      state.feedIndex = agency.feedIndex;
      state.agencyId = agency.agencyId;
      state.agencyName = agency.agencyName;
      state.agencyUrl = agency.agencyUrl;
      state.agencyTimezone = agency.agencyTimezone;
      state.agencyLang = agency.agencyLang;
      state.agencyPhone = agency.agencyPhone;
      state.location = agency.location;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload.gtfs.agency,
      };
    },
  },
});

export const { setAgency } = agencySlice.actions;
export default agencySlice.reducer;
