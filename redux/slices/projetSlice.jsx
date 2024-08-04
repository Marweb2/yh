/** @format */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projets: [],
  actualProject: {},
  actualProjetId: "",
  actualAssistant: {},
  actualIndex: null,
  compatibilite: null,
};

const projetSlice = createSlice({
  name: "projets",
  initialState,
  reducers: {
    fetchProjets: (state, action) => {
      const { projets, projet } = action.payload;
      let newState = { ...state };
      if (projets) {
        newState.projets = projets;
      }
      if (projet) {
        newState.actualProject = projet;
      }
      return newState;
    },

    updateProjets: (state, action) => {
      const {
        projet,
        assistants,
        actualAssistant,
        compatibilite,
        actualIndex,
      } = action.payload;
      let newState = { ...state };
      newState.projets = { projet, ...state.projets };
      newState.actualProject = projet;
      newState.assistants = assistants;
      newState.actualAssistant = actualAssistant;
      newState.actualIndex = actualIndex;
      newState.compatibilite = compatibilite;
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

    setActualProjetId: (state, action) => {
      const { actualProjetId } = action.payload;
      let newState = { ...state };
      newState.actualProjetId = actualProjetId;
      return newState;
    },

    removeProjets: () => {
      return initialState;
    },
  },
});

export const {
  fetchProjets,
  updateProjets,
  setActualProject,
  setAssistants,
  setActualAssistant,
  removeProjets,
  setActualProjetId,
} = projetSlice.actions;
export default projetSlice.reducer;
