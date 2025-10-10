import { configureStore } from "@reduxjs/toolkit";
import rootRedcuer from "./rootReducer";
import { authApi } from "../features/api/authApi";
import { teamApi } from "../features/api/teamApi";
import { tournamentApi } from "../features/api/tournamentApi";
import { playerApi } from "../features/api/playerApi";
import { walletApi } from "../features/api/walletApi";

export const appStore = configureStore({
  reducer: rootRedcuer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware, teamApi.middleware, tournamentApi.middleware, playerApi.middleware,walletApi.middleware),
});

const initializeApp = async () => {
  await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};
initializeApp();
