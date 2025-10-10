import express from "express";
import isAuthenticatedUser from "../../middleware/isAuthenticatedUser.js";
import isAdmin from "../../middleware/isAdmin.js";
import {
  addMoney,
  verifyPayment,
  getWalletBalance,
  getTransactions,
  deleteTransaction,
  requestWithdrawal,
  payoutWebhook,
} from "../../controllers/user/wallet.controller.js";

const walletRouter = express.Router();

walletRouter.post("/add", isAuthenticatedUser, addMoney);
walletRouter.post("/verify", verifyPayment);
walletRouter.get("/balance", isAuthenticatedUser, getWalletBalance);
walletRouter.get("/transactions", isAuthenticatedUser, getTransactions);
walletRouter.delete("/transactions/:id",isAuthenticatedUser, isAdmin, deleteTransaction);
walletRouter.post("/withdraw", isAuthenticatedUser, requestWithdrawal);
walletRouter.post("/webhook/payout", payoutWebhook);

export default walletRouter;
