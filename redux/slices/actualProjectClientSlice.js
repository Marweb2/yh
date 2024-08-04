/** @format */

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  actualProjectId2: "",
};
const userSlice = createSlice({
  name: "actualProjectId",
  initialState,
  reducers: {
    updateActualProject: (state, action) => {
      const { actualProjectId2 } = action.payload;
      let newState = { ...state };
      newState.actualProjectId2 = actualProjectId2;
      return newState;
    },
  },
});

export const { updateActualProject } = userSlice.actions;
export default userSlice.reducer;
