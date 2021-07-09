import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppThunk } from '../../app/store';

const SERVER = 'http://localhost:3000';

export const fetchLines = (city: string): AppThunk => async dispatch => {
  const response = await fetch(`${SERVER}/api/lines/${city}`);
  const lines = await response.json();

  dispatch(linesApiSlice.actions.setLines(lines));
};

interface LinesData {
  data: any;
}

const initialState: LinesData = {
  data: [],
};

const linesApiSlice = createSlice({
  name: 'lines',
  initialState,
  reducers: {
    setLines(state, action: PayloadAction<any>) {
      state.data = action.payload;
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        data: action.payload.lines.data,
      };
    },
    /*
    builder.addCase(fetchLines.fulfilled, (state, action: PayloadAction<any>) => {
      state.lines = action.payload;
      state.loading = 'succeeded';
    });
    builder.addCase(fetchLines.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchLines.rejected, (state, action) => {
      state.error = action.error;
      state.loading = 'failed';
    });
    */
  },
});

export const { setLines } = linesApiSlice.actions;
export default linesApiSlice.reducer;
