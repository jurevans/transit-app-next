import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  value: string;
}

const initialState: DashboardState = {
  value: 'Initial value!',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updatedDashboard(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

export const { updatedDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
