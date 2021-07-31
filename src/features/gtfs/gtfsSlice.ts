import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../../config/api.config";
import { AppThunk } from "../../app/store";

interface GTFSStateItem {
  [key: string]: any;
}

interface GTFSState {
  data: GTFSStateItem;
}

interface Entity {
  id: string;
  name: string;
  location: [number, number];
  stops: any;
  routes: string[];
}

const initialState: GTFSState = { data: {} };

export const fetchGTFS = (feedIndex: number, stationIds: string[]): AppThunk => async dispatch => {
  const response = await fetch(`${API_URL}/api/stations/gtfs/?feedIndex=${feedIndex}&id=${stationIds.join(',')}`);
  const data = await response.json();

  dispatch(gtfsSlice.actions.setGTFS(data));
};

const gtfsSlice = createSlice({
  name: 'gtfs',
  initialState,
  reducers: {
    setGTFS(state, action: PayloadAction<any>) {
      const { data, updated } = action.payload;
      const newState: GTFSStateItem = {};
      if (data) {
        data.forEach((entity: Entity) => {
          newState[entity.id] = entity;
        });
      }
      state.data = { 
        ...state.data, // an idea I'm playing around with
        ...newState,
      };
    },
  },
});

export const { setGTFS: setGTFS } = gtfsSlice.actions;
export default gtfsSlice.reducer;
