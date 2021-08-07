import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../../config/api.config";
import { AppThunk } from "../../app/store";

interface GTFSState {
  [key: string]: any;
}

interface Entity {
  id: string;
  name: string;
  location: [number, number];
  stops: any;
  routes: string[];
}

const initialState: GTFSState = {};

export const fetchGTFS = (feedIndex: number = 1, stationIds: string[]): AppThunk => async dispatch => {
  const response = await fetch(`${API_URL}/api/stations/gtfs/?feedIndex=${feedIndex}&id=${stationIds.join(',')}`);
  const data = await response.json();

  dispatch(gtfsSlice.actions.setGTFS(data));
};

const gtfsSlice = createSlice({
  name: 'gtfs',
  initialState,
  reducers: {
    setGTFS(state, action: PayloadAction<any>) {
      const { data } = action.payload;
      if (data) {
        data.forEach((entity: Entity) => {
          state[entity.id] = entity;
        });
      }
    },
  },
});

export const { setGTFS: setGTFS } = gtfsSlice.actions;
export default gtfsSlice.reducer;
