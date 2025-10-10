import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";

import { authApi } from "../features/api/authApi";
import { teamApi } from "../features/api/teamApi";
import { tournamentApi } from "../features/api/tournamentApi";
import { playerApi } from "../features/api/playerApi";
import { walletApi } from "../features/api/walletApi";

const rootRedcuer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [teamApi.reducerPath]: teamApi.reducer,
  [tournamentApi.reducerPath]: tournamentApi.reducer,
  [playerApi.reducerPath]: playerApi.reducer,
  [walletApi.reducerPath]: walletApi.reducer,
  auth: authReducer,
});
export default rootRedcuer;
