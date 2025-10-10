import { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Trophy,
  Zap,
  Eye,
  EyeOff,
  CreditCard,
  Target,
  Crown,
  Flame,
  TrendingUp,
  Banknote,
} from "lucide-react";
import {
  useGetWalletBalanceQuery,
  useAddMoneyMutation,
  useVerifyPaymentMutation,
  useGetTransactionsQuery,
} from "../../features/api/walletApi";
import { useDispatch } from "react-redux";
import {
  useLoadUserQuery,
  useSaveWithdrawalMethodMutation,
} from "../../features/api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ButtonLoader from "../../components/Loader/ButtonLoader";

const WalletComponent = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [addAmount, setAddAmount] = useState(10);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [methodType, setMethodType] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [isSavingMethod, setIsSavingMethod] = useState(false);
  const navigate = useNavigate();

  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
  } = useGetWalletBalanceQuery();
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useGetTransactionsQuery();
  const { data: userData } = useLoadUserQuery();
  const [addMoney, { error: addMoneyError }] = useAddMoneyMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [saveWithdrawalMethod] = useSaveWithdrawalMethodMutation();

  const walletBalance = balanceData?.balance || 0;

  const transactions = transactionsData?.transactions || [];

  const quickActions = [
    {
      icon: Plus,
      label: "Add Money",
      color: "from-green-500 to-green-600",
      action: "deposit",
    },
    {
      icon: ArrowUpRight,
      label: "Withdraw",
      color: "from-blue-500 to-blue-600",
      action: "withdraw",
    },
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case "win":
        return { icon: Trophy, color: "text-green-500" };
      case "entry":
        return { icon: Target, color: "text-red-500" };
      case "deposit":
        return { icon: ArrowDownLeft, color: "text-green-500" };
      case "withdrawal":
        return { icon: ArrowUpRight, color: "text-blue-500" };
      default:
        return { icon: Wallet, color: "text-orange-500" };
    }
  };

  const getTransactionDescription = (tx) => {
    return (
      tx.description ||
      `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} of ₹${Math.abs(
        tx.amount
      )}`
    );
  };

  const getTransactionTime = (tx) => {
    return new Date(tx.createdAt).toLocaleString();
  };

  const handleAddMoney = async () => {
    if (addAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsAddingMoney(true);

    try {
      const { orderId, amount, key } = await addMoney({
        amount: addAmount,
      }).unwrap();
      const options = {
        key,
        amount: amount * 100,
        currency: "INR",
        order_id: orderId,
        handler: async (response) => {
          try {
            await verifyPayment(response).unwrap();
            toast.success("Money added successfully");
            setAddAmount(0);
            setShowAddMoneyModal(false);
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#F37254" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      if (error.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error(
          "Failed to initiate add money: " +
            (error.data?.message || "Unknown error")
        );
      }
    } finally {
      setIsAddingMoney(false);
    }
  };

  const handleSaveWithdrawalMethod = async () => {
    if (methodType === "upi" && !upiId) {
      toast.error("UPI ID is required");
      return;
    }
    if (
      methodType === "bank" &&
      (!bankName || !accountNumber || !ifscCode || !accountHolderName)
    ) {
      toast.error("All bank details are required");
      return;
    }

    setIsSavingMethod(true);

    try {
      const details =
        methodType === "upi"
          ? { upiId }
          : { bankName, accountNumber, ifscCode, accountHolderName };
      await saveWithdrawalMethod({ methodType, details }).unwrap();
      toast.success("Withdrawal method saved successfully");
      setShowWithdrawalModal(false);
      setWithdrawAmount(0);
    } catch (error) {
      toast.error(
        "Failed to save withdrawal method: " +
          (error.data?.message || "Unknown error")
      );
    } finally {
      setIsSavingMethod(false);
    }
  };

  const handleWithdraw = async () => {
    if (withdrawAmount <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }
    if (withdrawAmount > walletBalance) {
      toast.error("Insufficient balance");
      return;
    }
    if (methodType === "upi" && !upiId) {
      toast.error("UPI ID is required", {
        style: { background: "#ef4444", color: "#fff" },
      });
      return;
    }
    if (
      methodType === "bank" &&
      (!bankName || !accountNumber || !ifscCode || !accountHolderName)
    ) {
      toast.error("All bank details are required");
      return;
    }

    // Placeholder for actual withdrawal logic
    toast.success("Withdrawal request initiated (placeholder)");
    setShowWithdrawalModal(false);
    setWithdrawAmount(0);
  };

  const handleQuickAction = (action) => {
    if (action === "withdraw") {
      setShowWithdrawalModal(true);
    } else if (action === "deposit") {
      setShowAddMoneyModal(true);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (userData?.user?.wallet?.withdrawalMethods) {
      const methods = userData.user.wallet.withdrawalMethods;
      setUpiId(methods.upi?.upiId || "");
      setBankName(methods.bank?.bankName || "");
      setAccountNumber(methods.bank?.accountNumber || "");
      setIfscCode(methods.bank?.ifscCode || "");
      setAccountHolderName(methods.bank?.accountHolderName || "");
    }
  }, [userData]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen pt-[6rem] lg:pt-[7.5rem]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-white">
              Gaming Wallet
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          <span className="text-orange-500 font-semibold">Gamer Pulse</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-orange-900/20 rounded-2xl p-6 mb-8 border border-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <span className="text-gray-300 font-medium">Total Balance</span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {showBalance ? (
                <Eye className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-baseline space-x-2 mb-6">
            <span className="text-base lg:text-xl font-bold text-white">
              {balanceLoading
                ? "Loading..."
                : balanceError
                ? "Error"
                : showBalance
                ? `₹${walletBalance.toFixed(2)}`
                : "••••••"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickAction(action.action)}
            className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-105"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-white font-medium">{action.label}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-xl p-1 mb-6">
        {[
          { id: "overview", label: "Overview" },
          { id: "transactions", label: "Transactions" },
          { id: "tournaments", label: "Tournaments" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-gray-800 rounded-2xl p-6">
        {activeTab === "overview" && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 text-orange-500 mr-2" />
              Recent Activity
            </h3>
            {transactionsLoading ? (
              <p className="text-gray-400">Loading transactions...</p>
            ) : transactionsError ? (
              <p className="text-red-400">Error loading transactions</p>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 3).map((transaction) => {
                  const { icon: IconComponent, color } = getTransactionIcon(
                    transaction.type
                  );
                  return (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg ${
                            color.includes("green")
                              ? "bg-green-500/20"
                              : color.includes("red")
                              ? "bg-red-500/20"
                              : color.includes("blue")
                              ? "bg-blue-500/20"
                              : "bg-orange-500/20"
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {getTransactionDescription(transaction)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {getTransactionTime(transaction)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            transaction.amount > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}₹
                          {Math.abs(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center">
                No recent transactions
              </p>
            )}
          </div>
        )}

        {activeTab === "transactions" && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">
              All Transactions
            </h3>
            {transactionsLoading ? (
              <p className="text-gray-400">Loading transactions...</p>
            ) : transactionsError ? (
              <p className="text-red-400">Error loading transactions</p>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const { icon: IconComponent, color } = getTransactionIcon(
                    transaction.type
                  );
                  return (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            color.includes("green")
                              ? "bg-green-500/20"
                              : color.includes("red")
                              ? "bg-red-500/20"
                              : color.includes("blue")
                              ? "bg-blue-500/20"
                              : "bg-orange-500/20"
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 ${color}`} />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {getTransactionDescription(transaction)}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {getTransactionTime(transaction)}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-semibold text-sm ${
                          transaction.amount > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}₹
                        {Math.abs(transaction.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No transactions</p>
            )}
          </div>
        )}

        {activeTab === "tournaments" && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Trophy className="w-5 h-5 text-orange-500 mr-2" />
              Tournament Stats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Crown className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-bold text-2xl">12</span>
                </div>
                <p className="text-white font-medium">Tournaments Won</p>
                <p className="text-gray-400 text-sm">This month</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-6 h-6 text-orange-400" />
                  <span className="text-orange-400 font-bold text-2xl">28</span>
                </div>
                <p className="text-white font-medium">Tournaments Joined</p>
                <p className="text-gray-400 text-sm">This month</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <span className="text-blue-400 font-bold text-2xl">43%</span>
                </div>
                <p className="text-white font-medium">Win Rate</p>
                <p className="text-gray-400 text-sm">Overall</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Add Money</h2>
              <Plus className="w-6 h-6 text-green-500" />
            </div>

            <input
              type="number"
              placeholder="Enter amount to add"
              value={addAmount}
              onChange={(e) => setAddAmount(parseFloat(e.target.value) || 10)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              min="10"
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="bg-gray-600 text-white py-2 px-6 rounded-xl hover:bg-gray-500 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                disabled={addAmount <= 0 || isAddingMoney}
                className="bg-green-500 text-white py-2 px-6 rounded-xl hover:bg-green-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingMoney ? <ButtonLoader /> : "Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Withdraw Funds</h2>
              <Banknote className="w-6 h-6 text-orange-500" />
            </div>

            <input
              type="number"
              placeholder="Enter amount to withdraw"
              value={withdrawAmount}
              onChange={(e) =>
                setWithdrawAmount(parseFloat(e.target.value) || 0)
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              min="0"
            />

            <select
              value={methodType}
              onChange={(e) => setMethodType(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>

            {methodType === "upi" ? (
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter UPI ID (e.g., name@upi)"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Enter Account Holder Name"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter Bank Name"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter Account Number"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="Enter IFSC Code"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </>
            )}

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleSaveWithdrawalMethod}
                disabled={isSavingMethod}
                className="bg-blue-500 text-white py-2 px-6 rounded-xl hover:bg-blue-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingMethod ? <ButtonLoader /> : "Save Method"}
              </button>
              <div className="text-gray-400 text-sm">
                Balance: ₹{walletBalance.toFixed(2)}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="bg-gray-600 text-white py-2 px-6 rounded-xl hover:bg-gray-500 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="bg-orange-500 text-white py-2 px-6 rounded-xl hover:bg-orange-600 transition-all font-medium"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletComponent;
