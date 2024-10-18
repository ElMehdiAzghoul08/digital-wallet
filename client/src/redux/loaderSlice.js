// In your Redux slice or reducer file
import { createSlice } from "@reduxjs/toolkit";

const loadersSlice = createSlice({
  name: "loaders",
  initialState: {
    loading: false,
  },
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    HideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoading, HideLoading } = loadersSlice.actions;
export default loadersSlice.reducer;
