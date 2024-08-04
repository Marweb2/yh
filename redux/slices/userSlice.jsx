/** @format */

import { createSlice } from "@reduxjs/toolkit";
const initialState = { user: null };
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserInfos: (state, action) => {
      const { user } = action.payload;
      let newState = { ...state };
      newState.user = user;
      return newState;
    },

    updateUserInfos: (state, action) => {
      const { user } = action.payload;
      let newState = { ...state };
      newState.user = { ...state.user, ...user };
      return newState;
    },

    removeUserInfos: () => {
      return initialState;
    },
  },
});

export const { fetchUserInfos, updateUserInfos, removeUserInfos } =
  userSlice.actions;
export default userSlice.reducer;
