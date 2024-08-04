/** @format */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isActive: false,
  deleteFavouriteAssistant: { id: "", accept: false },
  deleteAvisAssistant: { id: "", accept: false },
  projectId: "",
  popUpStatut: "",
  data: "",
  avisId: "",
  name: "",
};
const popUpSlice = createSlice({
  name: "popUp",
  initialState,
  reducers: {
    updateIsActive: (state, action) => {
      const { isActive } = action.payload;
      let newState = { ...state };
      newState.isActive = isActive;
      return newState;
    },

    updateDeleteFavouriteAssistant: (state, action) => {
      const payload = action.payload;
      let newState = { ...state };
      console.log(payload);

      if (payload.id && payload.projectId) {
        newState.deleteFavouriteAssistant = {
          ...newState.deleteFavouriteAssistant,
          id: payload.id,
        };
        newState.projectId = payload.projectId;
      } else {
        newState.deleteFavouriteAssistant = {
          ...newState.deleteFavouriteAssistant,
          accept: payload.accept,
        };
      }
      return newState;
    },

    updateDeleteAvisAssistant: (state, action) => {
      const payload = action.payload;
      let newState = { ...state };
      if (payload.id) {
        newState.deleteAvisAssistant = {
          ...newState.deleteAvisAssistant,
          id: payload.id,
        };
      } else {
        newState.deleteAvisAssistant = {
          ...newState.deleteAvisAssistant,
          accept: payload.accept,
        };
      }
      return newState;
    },
    updatePopUpStatut: (state, action) => {
      const payload = action.payload;
      let newState = { ...state };
      newState.popUpStatut = payload.popUpStatut;
      if (payload.data && payload.avisId) {
        console.log(payload.avisId, "ook");
        newState.data = payload.data;
        newState.avisId = payload.avisId;
      }
      if (payload.avisId) {
        newState.avisId = payload.avisId;
      }
      if (payload.name) {
        newState.name = payload.name;
      }
      return newState;
    },
  },
});

export const {
  updateIsActive,
  updateDeleteFavouriteAssistant,
  updateDeleteAvisAssistant,
  updatePopUpStatut,
} = popUpSlice.actions;
export default popUpSlice.reducer;
