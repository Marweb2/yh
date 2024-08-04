/** @format */

import { createSlice } from "@reduxjs/toolkit";
const initialState = { messages: [] };
const userSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    updateMessages: (state, action) => {
      const { messages } = action.payload;
      let newState = { ...state };
      newState.messages = messages;
      return newState;
    },
    updateMessage: (state, action) => {
      const { message } = action.payload;
      let newState = { ...state };
      newState.messages = [...newState.messages, message];
      return newState;
    },
  },
});

export const { updateMessage, updateMessages } = userSlice.actions;
export default userSlice.reducer;
