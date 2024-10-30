import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    reloadUser: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    ReloadUser(state, action) {
      state.reloadUser = action.payload;
    },
    UpdateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { UpdateUser } = userSlice.actions;
export const { setUser, ReloadUser } = userSlice.actions;
export default userSlice.reducer;
