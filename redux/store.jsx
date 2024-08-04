/** @format */

"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import userSlice from "./slices/userSlice";
import persistSlice from "./slices/persistSlice";
import projetSlice from "./slices/projetSlice";
import popUpSlice from "./slices/popUpSlice";
import clientProjectSlice from "./slices/clientProjectSlice";
import socketIoSlice from "./slices/socketIoSlice";
import messageSlice from "./slices/messageSlice";
import clientAvisPotentielSlice from "./slices/clientAvisPotentielSlice";
import actualProjectClientSlice from "./slices/actualProjectClientSlice";
import rightAvisSlice from "./slices/rightAvisSlice";
import conversationRightSlice from "./slices/conversationRightSlice";
import questionResponsesSlice from "./slices/questionResponsesSlice";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["persistInfos"],
};

const rootReducer = combineReducers({
  user: userSlice,
  persistInfos: persistSlice,
  projets: projetSlice,
  clientProject: clientProjectSlice,
  popUp: popUpSlice,
  socket: socketIoSlice,
  messages: messageSlice,
  clientAvis: clientAvisPotentielSlice,
  actualProjectId: actualProjectClientSlice,
  rightAvis: rightAvisSlice,
  conversationAvis: conversationRightSlice,
  assistantResponses: questionResponsesSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getdefaultMiddleware) =>
    getdefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);
export default store;
export { persistor };
