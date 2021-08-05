import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

interface AgencyData {
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

interface AgencyState {
  data: AgencyData;
}

const initialState: AgencyState = {
  data: {},
};

const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    setAgency(state, action: PayloadAction<any>) {
      state.data = action.payload;
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
