/** @format */

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  conversationAvis: [],
  conversationAvisIndex: 0,
  conversationAvisLength: 0,
  actualConversationAvis: {},
  noConversation: false,
};
const userSlice = createSlice({
  name: "conversationAvis",
  initialState,
  reducers: {
    updateConversationRightAvis: (state, action) => {
      const {
        conversationAvis,
        conversationAvisLength,
        conversationAvisIndex,
        actualConversationAvis,
        noConversation,
      } = action.payload;
      let newState = { ...state };
      if (conversationAvis) {
        newState.conversationAvis = conversationAvis;
      }
      if (conversationAvisLength) {
        newState.conversationAvisLength = conversationAvisLength;
      }
      if (conversationAvisIndex >= 0) {
        newState.conversationAvisIndex = conversationAvisIndex;
      }
      if (actualConversationAvis) {
        newState.actualConversationAvis = actualConversationAvis;
      }
      if (noConversation === true || noConversation === false) {
        newState.noConversation = noConversation;
      }
      return newState;
    },
  },
});

export const { updateConversationRightAvis } = userSlice.actions;
export default userSlice.reducer;
