import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../../models/user/user.model.js";
import { Transaction } from "../../models/user/transaction.model.js";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.id;

    if (!amount || amount < 10) {
      return res
        .status(400)
        .json({ success: false, message: "Minimum amount is ₹10" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const shortUserId = userId.toString().slice(-8);
    const shortTimestamp = Date.now().toString(36);
    const receipt = `WLT_${shortUserId}_${shortTimestamp}`;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: userId.toString(),
        type: "wallet_deposit",
      },
    };

    const order = await instance.orders.create(options);

    const transaction = new Transaction({
      user: userId,
      type: "deposit",
      amount,
      orderId: order.id,
      paymentId: null,
      status: "pending",
      description: "Wallet deposit via Razorpay",
    });
    await transaction.save();

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: amount.toFixed(2),
      key: process.env.RAZORPAY_KEY_ID,
      currency: "INR",
    });
  } catch (error) {
    console.error("Add money error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during add money" });
  }
};

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, method } = req.body;
    const userId = req.id;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum withdrawal amount is ₹100",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    let payoutDetails;
    if (method === "upi") {
      if (!user.wallet.withdrawalMethods.upi.upiId) {
        return res.status(400).json({
          success: false,
          message: "UPI ID not set",
        });
      }
      payoutDetails = {
        account_number: "your_razorpayx_account_number",
        fund_account: {
          account_type: "vpa",
          vpa: {
            address: user.wallet.withdrawalMethods.upi.upiId,
          },
          contact: {
            name: user.username,
            email: user.email,
            contact: user.phoneNumber,
            type: "customer",
          },
        },
        amount: amount * 100,
        currency: "INR",
        mode: "UPI",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: `WD_${Date.now()}`,
        narration: "Withdrawal from gaming wallet",
      };
    } else if (method === "bank") {
      const bank = user.wallet.withdrawalMethods.bank;
      if (!bank.accountNumber || !bank.ifscCode || !bank.accountHolderName) {
        return res.status(400).json({
          success: false,
          message: "Bank details not complete",
        });
      }
      payoutDetails = {
        account_number: "your_razorpayx_account_number",
        fund_account: {
          account_type: "bank_account",
          bank_account: {
            name: bank.accountHolderName,
            account_number: bank.accountNumber,
            ifsc: bank.ifscCode,
          },
          contact: {
            name: user.username,
            email: user.email,
            contact: user.phoneNumber,
            type: "customer",
          },
        },
        amount: amount * 100,
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: `WD_${Date.now()}`,
        narration: "Withdrawal from gaming wallet",
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid withdrawal method",
      });
    }

    // Create payout via Razorpay
    const payout = await razorpay.payouts.create(payoutDetails);

    // Deduct amount and create transaction
    user.wallet.balance -= amount;
    await user.save();

    const transaction = new Transaction({
      user: userId,
      type: "withdrawal",
      amount: -amount,
      status: "pending",
      paymentId: payout.id,
      description: `Withdrawal via ${method.toUpperCase()}`,
    });
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Withdrawal requested successfully",
      payout,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process withdrawal",
      error: error.message,
    });
  }
};

export const payoutWebhook = async (req, res) => {
  const { payload } = req.body;
  const payoutId = payload.payout.entity.id;
  const status = payload.payout.entity.status;

  const transaction = await Transaction.findOne({ paymentId: payoutId });
  if (transaction) {
    transaction.status = status === "processed" ? "completed" : status;
    await transaction.save();
  }

  res.status(200).json({ success: true });
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const transaction = await Transaction.findOne({
      orderId: razorpay_order_id,
    });
    if (!transaction || transaction.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid transaction" });
    }

    transaction.paymentId = razorpay_payment_id;
    transaction.status = "completed";
    await transaction.save();

    await User.findByIdAndUpdate(transaction.user, {
      $inc: { "wallet.balance": transaction.amount },
    });

    return res
      .status(200)
      .json({ success: true, message: "Payment verified and added to wallet" });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};

export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("wallet.balance");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, balance: user.wallet.balance });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access transactions",
      });
    }

    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      });
    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching transactions" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete transactions",
      });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await Transaction.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
      error: error.message,
    });
  }
};
