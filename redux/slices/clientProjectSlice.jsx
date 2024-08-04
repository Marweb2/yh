/** @format */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientProjets: [],
  actualClientProjet: {},
  actualClient: {},
  pageLength: 1,
  lastClientIndex: 1,
  currentPage: 1,
  actualClientIndex: null,
  correspondance: null,
  compatibilite: null,
  prev: false,
  next: false,
};

const clientProjectSlice = createSlice({
  name: "clientProject",
  initialState,
  reducers: {
    fetchClientProjets: (state, action) => {
      const { clientProjets, actualClientProjet, correspondance } =
        action.payload;
      let newState = { ...state };
      if (clientProjets) {
        newState.clientProjets = clientProjets;
      }
      if (actualClientProjet) {
        newState.actualClientProjet = actualClientProjet;
      }
      if (correspondance) {
        newState.correspondance = correspondance;
      }
      return newState;
    },

    updateProjets: (state, action) => {
      const {
        projet,
        assistants,
        actualClient,
        compatibilite,
        actualClientIndex,
        pageLength,
        lastClientIndex,
        currentPage,
        prev,
        next,
      } = action.payload;
      let newState = { ...state };
      newState.projets = { projet, ...state.projets };
      if (projet) {
        newState.actualProject = projet;
      }
      if (assistants) {
        newState.assistants = assistants;
      }
      if (actualClient) {
        newState.actualClient = actualClient;
      }
      if (actualClientIndex >= 0) {
        newState.actualClientIndex = actualClientIndex;
      }
      if (compatibilite) {
        newState.compatibilite = compatibilite;
      }
      if (pageLength) {
        newState.pageLength = pageLength;
      }
      if (lastClientIndex != undefined) {
        newState.lastClientIndex = lastClientIndex;
      }
      if (currentPage) {
        newState.currentPage = currentPage;
      }
      if (prev != undefined) {
        newState.prev = prev;
      }
      if (next) {
        newState.next = next;
      }
      return newState;
    },

    setActualProject: (state, action) => {
      const { projet, projetId } = action.payload;
      let newState = { ...state };
      newState.actualProject = projet;
      if (projetId) {
        newState.projets = [projetId, ...newState.projets];
      }
      return newState;
    },

    setActualAssistant: (state, action) => {
      const { actualAssistant, compatibilite, actualIndex } = action.payload;
      let newState = { ...state };
      newState.actualAssistant = actualAssistant;
      newState.actualIndex = actualIndex;
      newState.compatibilite = compatibilite;
      return newState;
    },

    removeProjets: () => {
      return initialState;
    },
  },
});

export const {
  fetchClientProjets,
  updateProjets,
  setActualProject,
  setAssistants,
  setActualAssistant,
  removeProjets,
} = clientProjectSlice.actions;
export default clientProjectSlice.reducer;
