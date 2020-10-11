import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./reducers";

const persistConfig = {
  key: "example",
  storage,
  whitelist: ["example"],
};

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
});

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
