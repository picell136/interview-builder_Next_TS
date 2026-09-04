import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import interviewReducer from "./slices/interviewSlice";
import { apiSlice } from "./api/apiSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      interview: interviewReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
