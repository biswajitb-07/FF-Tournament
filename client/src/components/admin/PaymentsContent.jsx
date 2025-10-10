import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Minus,
  History,
  Check,
  Clock,
  X,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Shield,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useGetWalletBalanceQuery,
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from "../../features/api/walletApi";

const PaymentsContent = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery();
  const transactions = transactionsData?.transactions || [];

  const { data: balanceData, refetch: refetchBalance } =
    useGetWalletBalanceQuery();
  const userBalance = balanceData?.balance || 0;

  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchTransactions(), refetchBalance()]);
      toast.success("Page refresh successful!");
    } catch (error) {
      toast.error("Failed to refresh page");
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculateStats = () => {
    const totalDeposits = transactions
      .filter((t) => t.type === "deposit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter((t) => t.type === "withdrawal" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);

    const pendingTransactions = transactions.filter(
      (t) => t.status === "pending"
    ).length;
    const completedTransactions = transactions.filter(
      (t) => t.status === "completed"
    ).length;

    const totalFailed = transactions.filter(
      (t) => t.status === "failed"
    ).length;
    const totalRefunded = transactions.filter(
      (t) => t.status === "refunded"
    ).length;

    const totalUsers = [...new Set(transactions.map((t) => t.user._id))].length;

    return {
      totalDeposits,
      totalWithdrawals,
      totalVolume,
      pendingTransactions,
      completedTransactions,
      totalFailed,
      totalRefunded,
      totalUsers,
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    if (selectedTransaction || deleteConfirm) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [selectedTransaction, deleteConfirm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10";
      case "pending":
        return "text-orange-400 bg-orange-400/10";
      case "failed":
        return "text-red-400 bg-red-400/10";
      case "refunded":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <X className="w-4 h-4" />;
      case "refunded":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "deposit":
        return "text-green-400";
      case "withdrawal":
        return "text-orange-400";
      case "deduction":
        return "text-red-400";
      case "refund":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "deposit":
        return <Plus className="w-4 h-4" />;
      case "withdrawal":
        return <Minus className="w-4 h-4" />;
      case "deduction":
        return <Minus className="w-4 h-4" />;
      case "refund":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatAmount = (amount, type) => {
    const sign = type === "deposit" || type === "refund" ? "+" : "-";
    return `${sign}$${amount.toLocaleString()}`;
  };

  const handleDeleteTransaction = async (transactionId) => {
    setIsDeleting(true);
    try {
      await deleteTransaction(transactionId).unwrap();
      setDeleteConfirm(null);
      toast.success("Transaction deleted successfully!");
      refetchTransactions();
    } catch (error) {
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Shield },
    { id: "transactions", label: "All Transactions", icon: History },
  ];

  if (transactionsLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-orange-400" />
              <h1 className="text-3xl font-bold text-orange-400">
                Admin Payment Dashboard
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isRefreshing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>
          <p className="text-gray-400">
            Monitor and manage all user transactions and payments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">
                  Total Volume
                </p>
                <p className="text-2xl font-bold text-white">
                  ${stats.totalVolume.toLocaleString()}
                </p>
                <p className="text-orange-200 text-xs mt-1">
                  +12% from last month
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Total Deposits
                </p>
                <p className="text-2xl font-bold text-white">
                  ${stats.totalDeposits.toLocaleString()}
                </p>
                <p className="text-green-200 text-xs mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% this week
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Total Withdrawals
                </p>
                <p className="text-2xl font-bold text-white">
                  ${stats.totalWithdrawals.toLocaleString()}
                </p>
                <p className="text-blue-200 text-xs mt-1 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -3% this week
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Minus className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalUsers}
                </p>
                <p className="text-purple-200 text-xs mt-1">+5 new this week</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900 rounded-lg p-1 mb-8 max-w-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center cursor-pointer ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-orange-400 font-semibold">Completed</h3>
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400">
                  {stats.completedTransactions}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Successfully processed
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-orange-400 font-semibold">Pending</h3>
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <p className="text-3xl font-bold text-orange-400">
                  {stats.pendingTransactions}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Awaiting processing
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-orange-400 font-semibold">Failed</h3>
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-red-400">
                  {stats.totalFailed}
                </p>
                <p className="text-gray-400 text-sm mt-2">Requires attention</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-orange-400 font-semibold">Refunded</h3>
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-blue-400">
                  {stats.totalRefunded}
                </p>
                <p className="text-gray-400 text-sm mt-2">Money returned</p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-orange-400">
                  Recent Transactions
                </h2>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All</span>
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${getTypeColor(
                          transaction.type
                        )} bg-current/10`}
                      >
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.user.name}</p>
                        <p className="text-sm text-gray-400">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p
                          className={`font-bold ${getTypeColor(
                            transaction.type
                          )}`}
                        >
                          {formatAmount(transaction.amount, transaction.type)}
                        </p>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(transaction)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="deduction">Deduction</option>
                  <option value="refund">Refund</option>
                </select>
              </div>
            </div>

            {/* Enhanced Transactions Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-white">
                              {transaction.user.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {transaction.user.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`p-2 rounded-full ${getTypeColor(
                                transaction.type
                              )} bg-current/10`}
                            >
                              {getTypeIcon(transaction.type)}
                            </div>
                            <span className="capitalize font-medium">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div>
                            <p className="font-medium truncate">
                              {transaction.description}
                            </p>
                            {transaction.tournament && (
                              <p className="text-sm text-gray-400 truncate">
                                {transaction.tournament.name}
                              </p>
                            )}
                            {transaction.paymentId && (
                              <p className="text-xs text-gray-500 font-mono">
                                ID: {transaction.paymentId}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`font-bold text-lg ${getTypeColor(
                              transaction.type
                            )}`}
                          >
                            {formatAmount(transaction.amount, transaction.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {getStatusIcon(transaction.status)}
                            <span className="ml-2 capitalize">
                              {transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          <div>
                            <p>
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-xs">
                              {new Date(
                                transaction.createdAt
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                setSelectedTransaction(transaction)
                              }
                              className="p-2 text-orange-400 cursor-pointer hover:text-orange-300 hover:bg-orange-400/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(transaction)}
                              className="p-2 text-red-400 cursor-pointer hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-3 rounded-full ${getTypeColor(
                      selectedTransaction.type
                    )} bg-current/10`}
                  >
                    {getTypeIcon(selectedTransaction.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-orange-400">
                      Transaction Details
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Complete transaction information
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-orange-400 font-medium mb-3">
                      User Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="font-medium">
                          {selectedTransaction.user.username}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="font-medium text-sm">
                          {selectedTransaction.user.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">User ID:</span>
                        <span className="font-mono text-xs">
                          {selectedTransaction.user._id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-orange-400 font-medium mb-3">
                      Transaction Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`p-1 rounded ${getTypeColor(
                              selectedTransaction.type
                            )} bg-current/10`}
                          >
                            {getTypeIcon(selectedTransaction.type)}
                          </div>
                          <span
                            className={`capitalize font-medium ${getTypeColor(
                              selectedTransaction.type
                            )}`}
                          >
                            {selectedTransaction.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span
                          className={`font-bold text-lg ${getTypeColor(
                            selectedTransaction.type
                          )}`}
                        >
                          {formatAmount(
                            selectedTransaction.amount,
                            selectedTransaction.type
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(
                            selectedTransaction.status
                          )}`}
                        >
                          {getStatusIcon(selectedTransaction.status)}
                          <span className="ml-2 capitalize">
                            {selectedTransaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-orange-400 font-medium mb-3">
                      Payment Information
                    </h4>
                    <div className="space-y-2">
                      {selectedTransaction.paymentId && (
                        <div className="flex justify-between flex-col gap-1.5">
                          <span className="text-gray-400">Payment ID:</span>
                          <span className="font-mono text-sm wrap-anywhere">
                            {selectedTransaction.paymentId}
                          </span>
                        </div>
                      )}
                      {selectedTransaction.orderId && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order ID:</span>
                          <span className="font-mono text-sm">
                            {selectedTransaction.orderId}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <div className="text-right">
                          <p>
                            {new Date(
                              selectedTransaction.createdAt
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(
                              selectedTransaction.createdAt
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedTransaction.tournament && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-orange-400 font-medium mb-3">
                        Tournament
                      </h4>
                      <p className="text-white">
                        {selectedTransaction.tournament.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h4 className="text-orange-400 font-medium mb-2">
                  Description
                </h4>
                <p className="text-white">{selectedTransaction.description}</p>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={() => setDeleteConfirm(selectedTransaction)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Transaction</span>
                </button>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 cursor-pointer text-white rounded-lg transition-colors font-medium "
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Delete Transaction
                  </h3>
                  <p className="text-gray-400 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-medium">Transaction:</span>{" "}
                  {deleteConfirm.description}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-medium">User:</span>{" "}
                  {deleteConfirm.user.name}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Amount:</span>
                  <span
                    className={`ml-2 font-bold ${getTypeColor(
                      deleteConfirm.type
                    )}`}
                  >
                    {formatAmount(deleteConfirm.amount, deleteConfirm.type)}
                  </span>
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTransaction(deleteConfirm._id)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsContent;
