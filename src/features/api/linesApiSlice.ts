/**
 * Api slice
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
 
const SERVER = 'http://localhost:3000';

export const fetchLines = createAsyncThunk(
  'lines/fetchByCity',
  async (city: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER}/api/lines/${city}`);
      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export interface LinesState {
  lines: any,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error?: any;
};

const initialState: LinesState = {
  lines: {},
  loading: 'idle',
  error: null,
};

const linesApiSlice = createSlice({
  name: 'lines',
  initialState,
  reducers: {
    setLines(state, action: PayloadAction<any>) {
      state.lines = action.payload;
      state.loading = 'idle';
    }
  },
  extraReducers: (builder) => {
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
  },
});

export const { setLines } = linesApiSlice.actions;
export default linesApiSlice.reducer;
