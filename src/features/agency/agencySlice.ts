import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

interface AgencyState {
  data: {
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
    }
  } | null
}

const initialState: AgencyState = { data: null };

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
