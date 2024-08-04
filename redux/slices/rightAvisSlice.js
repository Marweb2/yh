/** @format */

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  avis: [],
  length: 0,
  index: 0,
  actualAvis: {},
};
const userSlice = createSlice({
  name: "rightAvis",
  initialState,
  reducers: {
    updateRightAvis: (state, action) => {
      const { avis, length, index, actualAvis } = action.payload;
      let newState = { ...state };
      if (avis) {
        newState.avis = avis;
      }
      if (length) {
        newState.length = length;
      }
      if (index >= 0) {
        newState.index = index;
      }
      if (actualAvis) {
        newState.actualAvis = actualAvis;
      }
      return newState;
    },
  },
});

export const { updateRightAvis } = userSlice.actions;
export default userSlice.reducer;
