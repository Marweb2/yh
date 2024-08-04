/** @format */

import { createSlice } from "@reduxjs/toolkit";
const initialState = { io: null };
const userSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    updateIO: (state, action) => {
      const { io } = action.payload;
      let newState = { ...state };
      newState.io = io;
      return newState;
    },
  },
});

export const { updateIO } = userSlice.actions;
export default userSlice.reducer;
