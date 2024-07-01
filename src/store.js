import { configureStore } from "@reduxjs/toolkit";

import camSlice from "./Features/CamSlice.js";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

const reducers = combineReducers({
  cam: camSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
