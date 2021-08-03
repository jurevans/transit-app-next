import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

interface AgencyState {
  feedIndex?: number;
  agencyId?: string;
  agencyName?: string;
  agencyUrl?: string;
  agencyTimezone?: string;
  agencyLang?: string;
  agencyPhone?: string;
  location?: {
    longitude: number;
    latitude: number;
  };
}

const initialState: AgencyState = {};

const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    setAgency(state, action: PayloadAction<any>) {
      state = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload.agency.data,
      }
    },
  },
});

export const { setAgency } = agencySlice.actions;
export default agencySlice.reducer;
