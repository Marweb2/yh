/** @format */

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  assistantId: "",
  body: {},
  isResponsesSent: false,
};
const userSlice = createSlice({
  name: "assistantResponses",
  initialState,
  reducers: {
    updateAssistantReponses: (state, action) => {
      let newState = { ...state };
      const { assistantId, body, isResponsesSent } = action.payload;
      if (assistantId) {
        newState.assistantId = assistantId;
      }
      if (body) {
        newState.body = body;
      }
      if (isResponsesSent === true || isResponsesSent === false) {
        newState.isResponsesSent = isResponsesSent;
      }
      return newState;
    },
  },
});

export const { updateAssistantReponses } = userSlice.actions;
export default userSlice.reducer;
