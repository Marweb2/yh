import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userType: "client",
  lang: "fr",
  authToken: null,
  isAdmin: false,
};

const persistSlice = createSlice({
  name: "persistInfos",
  initialState,
  reducers: {
    updatePersistInfos: (state, action) => {
      const { userType, lang, authToken } = action.payload;
      let nwe = { ...state };
      if (userType) {
        nwe.userType = userType;
      }
      if (lang) {
        nwe.lang = lang;
      }
      if (authToken) {
        nwe.authToken = authToken;
      }
      return nwe;
    },
  },
});

export const { updatePersistInfos } = persistSlice.actions;
export default persistSlice.reducer;
