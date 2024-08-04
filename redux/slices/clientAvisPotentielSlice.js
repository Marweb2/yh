/** @format */

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  projetIdSelectionee: "",
  avis: [],
  avisTaille: null,
  taillePage: null,
  indexAvisSelectionee: null,
  idAssistantSelectionee: null,
  pageActuelle: 1,
  renderAvis: 0,
  indexMaximumPageFetched: 1,
  avisParPage: 4,
  fetchClientAvis: 0,
  isLastPage: false,
  isFirstPage: true,
  userInfos: {},
  lastIndex: null,
  next: false,
  prev: false,
};
const userSlice = createSlice({
  name: "clientAvis",
  initialState,
  reducers: {
    resetClientAvis: (state, action) => {
      let newState = { ...state };
      newState.avis = [];
      return newState;
    },
    updateClientAvis: (state, action) => {
      const { avis } = action.payload;
      state.avis = avis;
      return state;
    },
    updateClientAvisInfos: (state, action) => {
      const payload = action.payload;
      let newState = { ...state };
      if (payload.projetIdSelectionee) {
        newState.projetIdSelectionee = payload.projetIdSelectionee;
      }
      if (payload.taillePage) {
        newState.taillePage = payload.taillePage;
      }
      if (payload.pageActuelle) {
        newState.pageActuelle = payload.pageActuelle;
      }
      if (payload.next === true || payload.next === false) {
        newState.next = payload.next;
      }
      if (payload.prev === true || payload.prev === false) {
        newState.prev = payload.prev;
      }
      if (payload.indexAvisSelectionee >= 0) {
        newState.indexAvisSelectionee = payload.indexAvisSelectionee;
      }
      if (payload.idAssistantSelectionee) {
        newState.idAssistantSelectionee = payload.idAssistantSelectionee;
      }
      if (payload.avisTaille) {
        newState.avisTaille = payload.avisTaille;
      }
      if (payload.fetchClientAvis) {
        newState.fetchClientAvis = payload.fetchClientAvis;
      }
      if (payload.isFirstPage) {
        newState.isFirstPage = payload.isFirstPage;
      }
      if (payload.isLastPage) {
        newState.isLastPage = payload.isLastPage;
      }
      if (payload.indexMaximumPageFetched) {
        newState.indexMaximumPageFetched = payload.indexMaximumPageFetched;
      }
      if (payload.userInfos) {
        newState.userInfos = payload.userInfos;
      }
      if (payload.lastIndex) {
        newState.lastIndex = payload.lastIndex;
      }
      if (payload.renderAvis) {
        newState.renderAvis = payload.renderAvis;
      }
      return newState;
    },
  },
});

export const { updateClientAvis, updateClientAvisInfos } = userSlice.actions;
export default userSlice.reducer;
