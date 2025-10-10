import {
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  Trophy,
  Star,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Key,
  UserCheck,
  Settings,
  Trash2,
  Ban,
  UserX,
  Calendar,
  Mail,
  Award,
  Wallet,
  Clock,
} from "lucide-react";
import { IoGameController } from "react-icons/io5";
import { useState } from "react";
import {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useBlockUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useVerifyUserMutation,
  useResetPasswordMutation,
  useGetUserStatsQuery,
} from "../../features/api/playerApi";
import { toast } from "react-hot-toast";

const PlayersContent = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserForBan, setSelectedUserForBan] = useState(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [editForm, setEditForm] = useState({
    role: "",
    isVerified: false,
    newPassword: "",
  });

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery(
    search ? search : undefined
  );
  const { data: userDetails, isLoading: detailsLoading } = useGetUserByIdQuery(
    selectedUserId,
    { skip: !selectedUserId }
  );
  const { data: userStats, isLoading: statsLoading } = useGetUserStatsQuery(
    selectedUserId,
    { skip: !selectedUserId }
  );

  const date = new Date(userDetails?.user?.lastLoginAt);
  const loginTimeDate = date.toLocaleString() || "NA";

  const [blockUser] = useBlockUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [verifyUser] = useVerifyUserMutation();
  const [resetPassword] = useResetPasswordMutation();

  let users = usersData?.users || [];

  const getStatus = (user) => {
    if (user.isBlocked) return "Banned";
    if (!user.isVerified) return "not verify";
    return "Active";
  };

  const calculateWinRate = (user) => {
    return user.tournamentsPlayed > 0
      ? ((user.tournamentsWon / user.tournamentsPlayed) * 100).toFixed(0) + "%"
      : "0%";
  };

  if (statusFilter !== "All Status") {
    users = users.filter((user) => getStatus(user) === statusFilter);
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleView = (id) => {
    setSelectedUserId(id);
    setShowDetailsModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUserId(user._id);
    setEditForm({
      role: user.role,
      isVerified: user.isVerified,
      newPassword: "",
    });
    setShowEditModal(true);
  };

  const handleToggleBlock = (user) => {
    const isBlocking = !user.isBlocked;
    if (isBlocking) {
      setSelectedUserForBan(user);
      setBanReason("");
      setShowBanModal(true);
    } else {
      performBlock(user._id, false, "");
    }
  };

  const performBlock = async (id, isBlocking, reason) => {
    const loadingToast = toast.loading(
      `${isBlocking ? "Blocking" : "Unblocking"} user...`
    );
    try {
      await blockUser({ id, reason }).unwrap();
      toast.success(
        `User ${isBlocking ? "blocked" : "unblocked"} successfully`,
        { id: loadingToast }
      );
    } catch (error) {
      toast.error(
        `Error ${isBlocking ? "blocking" : "unblocking"} user: ${
          error?.data?.message || error.message
        }`,
        { id: loadingToast }
      );
    }
  };

  const handleConfirmBan = () => {
    if (selectedUserForBan) {
      performBlock(selectedUserForBan._id, true, banReason);
      setShowBanModal(false);
    }
  };

  const handleDelete = (id) => {
    setSelectedUserForDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserForDelete) {
      const loadingToast = toast.loading("Deleting user...");
      try {
        await deleteUser(selectedUserForDelete).unwrap();
        toast.success("User deleted successfully", { id: loadingToast });
      } catch (error) {
        toast.error(` ${error?.data?.message || error.message}`, {
          id: loadingToast,
        });
      }
      setShowDeleteModal(false);
    }
  };

  const handleUpdateRole = async () => {
    const loadingToast = toast.loading("Updating role...");
    try {
      await updateUserRole({
        id: selectedUserId,
        role: editForm.role,
      }).unwrap();
      toast.success("Role updated successfully", { id: loadingToast });
      setShowEditModal(false);
    } catch (error) {
      toast.error(`${error?.data?.message || error.message}`, {
        id: loadingToast,
      });
    }
  };

  const handleVerify = async () => {
    const loadingToast = toast.loading("Updating verification status...");
    try {
      await verifyUser({
        id: selectedUserId,
        isVerified: editForm.isVerified,
      }).unwrap();
      toast.success("Verification status updated successfully", {
        id: loadingToast,
      });
      setShowEditModal(false);
    } catch (error) {
      toast.error(
        `Error updating verification: ${error?.data?.message || error.message}`,
        { id: loadingToast }
      );
    }
  };

  const handleResetPassword = async () => {
    if (!editForm.newPassword) {
      toast.error("New password is required");
      return;
    }
    const loadingToast = toast.loading("Resetting password...");
    try {
      await resetPassword({
        id: selectedUserId,
        newPassword: editForm.newPassword,
      }).unwrap();
      toast.success("Password reset successfully", { id: loadingToast });
      setShowEditModal(false);
    } catch (error) {
      toast.error(` ${error?.data?.message || error.message}`, {
        id: loadingToast,
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Player",
        "Email",
        "Tournaments",
        "Win Rate",
        "Status",
        "Game ID",
        "Game Username",
        "Level",
      ],
      ...users.map((user) => [
        user.username,
        user.email,
        user.tournamentsPlayed,
        calculateWinRate(user),
        getStatus(user),
        user.gameDetails.gameId || "N/A",
        user.gameDetails.gameUsername || "N/A",
        user.gameDetails.level || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "players.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4 mx-auto"></div>
          <div className="text-orange-400 text-lg font-medium">
            Loading players...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Player Management
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Manage and monitor all registered players
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleExport}
              className="group relative bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600 flex-1 sm:flex-none text-sm sm:text-base cursor-pointer"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
              <span className="font-medium">Export Data</span>
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Search and Filter Section */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-gray-700/50">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder="Search players by name, email, or game username..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm sm:text-base"
                />
              </div>
              <div className="relative w-full lg:w-auto">
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="appearance-none bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600/50 rounded-xl text-white px-4 sm:px-6 py-2 sm:py-3 pr-10 sm:pr-12 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 cursor-pointer w-full text-sm sm:text-base bg-black"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Banned</option>
                </select>
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Players Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gradient-to-r from-gray-800/60 to-gray-900/60">
                <tr>
                  <th className="text-left p-3 sm:p-6 text-gray-300 font-semibold tracking-wider text-sm sm:text-base">
                    Player
                  </th>
                  <th className="text-left p-3 sm:p-6 text-gray-300 font-semibold tracking-wider text-sm sm:text-base">
                    Contact
                  </th>
                  <th className="text-left p-3 sm:p-6 text-gray-300 font-semibold tracking-wider text-sm sm:text-base">
                    Game Info
                  </th>
                  <th className="text-left p-3 sm:p-6 text-gray-300 font-semibold tracking-wider text-sm sm:text-base">
                    Performance
                  </th>
                  <th className="text-left p-3 sm:p-6 text-gray-300 font-semibold tracking-wider text-sm sm:text-base">
                    Status
                  </th>
                  <th className="text-left p-3 sm:p-6 text-gray-300 font-semibold tracking-wider text-sm sm:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-gradient-to-r hover:from-orange-500/5 hover:to-amber-500/5 transition-all duration-300"
                  >
                    <td className="p-3 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-base sm:text-lg">
                              {user.username[0].toUpperCase()}
                            </span>
                          </div>
                          {user.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-base sm:text-lg">
                            {user.username}
                          </div>
                          <div className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1).replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 sm:p-6">
                      <div className="space-y-1">
                        <div className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          {user.email}
                        </div>
                      </div>
                    </td>

                    <td className="p-3 sm:p-6">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="text-white font-medium flex items-center gap-2 text-sm sm:text-base">
                          <IoGameController className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                          {user.gameDetails.gameUsername || "N/A"}
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          ID: {user.gameDetails.gameId || "N/A"}
                        </div>
                        <div className="flex items-center gap-1 text-sm sm:text-base">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                          <span className="text-yellow-400 font-medium">
                            Level {user.gameDetails.level || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 sm:p-6">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                          <span className="text-white font-medium">
                            {user.tournamentsPlayed} Played
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                          <span className="text-green-400 font-bold">
                            {calculateWinRate(user)} Win Rate
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 sm:p-6">
                      <span
                        className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg ${
                          getStatus(user) === "Active"
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                            : getStatus(user) === "Banned"
                            ? "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/30"
                            : "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {getStatus(user) === "Active" ? (
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : getStatus(user) === "Banned" ? (
                          <UserX className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        {getStatus(user)}
                      </span>
                    </td>

                    <td className="p-3 sm:p-6">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(user._id)}
                          className="group p-1 sm:p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-200 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="group p-1 sm:p-2 hover:bg-green-500/20 rounded-lg text-green-400 hover:text-green-300 transition-all duration-200 cursor-pointer"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(user)}
                          className={`group p-1 sm:p-2 hover:bg-yellow-500/20 rounded-lg transition-all duration-200 cursor-pointer ${
                            user.isBlocked
                              ? "text-yellow-400 hover:text-yellow-300"
                              : "text-orange-400 hover:text-orange-300"
                          }`}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                        >
                          {user.isBlocked ? (
                            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                          ) : (
                            <Ban className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="group p-1 sm:p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-600/50">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 p-4 sm:p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-1 sm:p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
                      <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    Player Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-1 sm:p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-all duration-200 cursor-pointer"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {detailsLoading || statsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                    <span className="ml-4 text-gray-300 text-sm sm:text-base">
                      Loading details...
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* User Information */}
                    {userDetails && (
                      <div className="space-y-4 sm:space-y-6">
                        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
                          <h4 className="text-lg sm:text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                            Basic Information
                          </h4>
                          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                            <div className="flex items-center gap-3">
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                              <div>
                                <span className="text-gray-400">Username:</span>
                                <span className="ml-2 text-white font-medium">
                                  {userDetails.user.username}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                              <div>
                                <span className="text-gray-400">Email:</span>
                                <span className="ml-2 text-white font-medium">
                                  {userDetails.user.email}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                              <div>
                                <span className="text-gray-400">Role:</span>
                                <span className="ml-2 text-orange-400 font-medium capitalize">
                                  {userDetails.user.role.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                              <div>
                                <span className="text-gray-400">Verified:</span>
                                <span
                                  className={`ml-2 font-medium ${
                                    userDetails.user.isVerified
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {userDetails.user.isVerified ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
                          <h4 className="text-lg sm:text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                            <IoGameController className="h-4 w-4 sm:h-5 sm:w-5" />
                            Game Information
                          </h4>
                          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">Game ID:</span>
                              <span className="ml-2 text-white font-medium">
                                {userDetails.user.gameDetails.gameId || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">
                                Game Username:
                              </span>
                              <span className="ml-2 text-white font-medium">
                                {userDetails.user.gameDetails.gameUsername ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                              <span className="text-gray-400">Level:</span>
                              <span className="ml-2 text-yellow-400 font-bold">
                                {userDetails.user.gameDetails.level || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* User Statistics */}
                    {userStats && (
                      <div className="space-y-4 sm:space-y-6">
                        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
                          <h4 className="text-lg sm:text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                            <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                            Performance Stats
                          </h4>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-3 sm:p-4 border border-blue-500/30">
                              <div className="text-blue-300 text-xs sm:text-sm">
                                Tournaments Played
                              </div>
                              <div className="text-xl sm:text-2xl font-bold text-white">
                                {userStats.stats.tournamentsPlayed}
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 sm:p-4 border border-green-500/30">
                              <div className="text-green-300 text-xs sm:text-sm">
                                Tournaments Won
                              </div>
                              <div className="text-xl sm:text-2xl font-bold text-white">
                                {userStats.stats.tournamentsWon}
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-lg p-3 sm:p-4 border border-orange-500/30">
                              <div className="text-orange-300 text-xs sm:text-sm">
                                Win Rate
                              </div>
                              <div className="text-xl sm:text-2xl font-bold text-white">
                                {userStats.stats.winRate}
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 sm:p-4 border border-purple-500/30">
                              <div className="text-purple-300 text-xs sm:text-sm flex items-center gap-1">
                                <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                                Wallet Balance
                              </div>
                              <div className="text-xl sm:text-2xl font-bold text-white">
                                {userStats.stats.walletBalance}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-4 flex items-center gap-3 p-2 sm:p-3 bg-gray-700/30 rounded-lg text-sm sm:text-base">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <span className="text-gray-400">Last Login:</span>
                            <span className="text-white font-medium">
                              {loginTimeDate}
                            </span>
                          </div>
                        </div>

                        {/* Teams Section */}
                        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
                          <h4 className="text-lg sm:text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                            Teams ({userStats.stats.teams.length})
                          </h4>
                          {userStats.stats.teams.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4 max-h-64 overflow-y-auto">
                              {userStats.stats.teams.map((team, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-700/30 rounded-lg p-3 sm:p-4 border border-gray-600/30"
                                >
                                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <h5 className="text-base sm:text-lg font-semibold text-white">
                                      {team.teamName}
                                    </h5>
                                    <span className="bg-orange-500/20 text-orange-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border border-orange-500/30">
                                      {team.teamType}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm">
                                    <div>
                                      <span className="text-gray-400">
                                        Invite Code:
                                      </span>
                                      <span className="ml-2 text-white font-mono bg-gray-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                                        {team.inviteCode}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">
                                        Members:
                                      </span>
                                      <span className="ml-2 text-orange-400 font-semibold">
                                        {team.members.length}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-1 sm:space-y-2">
                                    <h6 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                                      Team Members:
                                    </h6>
                                    {team.members.map((member, i) => (
                                      <div
                                        key={i}
                                        className="bg-gray-800/50 rounded-md p-2 sm:p-3 text-xs sm:text-sm"
                                      >
                                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                              {member.username[0].toUpperCase()}
                                            </span>
                                          </div>
                                          <span className="text-white font-medium">
                                            {member.username}
                                          </span>
                                          <span className="text-gray-400">
                                            ({member.email})
                                          </span>
                                        </div>
                                        <div className="ml-6 sm:ml-8 space-y-0.5 sm:space-y-1 text-xs">
                                          <div>
                                            Game ID:{" "}
                                            <span className="text-gray-300">
                                              {member.gameDetails.gameId ||
                                                "N/A"}
                                            </span>
                                          </div>
                                          <div>
                                            Username:{" "}
                                            <span className="text-gray-300">
                                              {member.gameDetails
                                                .gameUsername || "N/A"}
                                            </span>
                                          </div>
                                          <div>
                                            Level:{" "}
                                            <span className="text-yellow-400 font-medium">
                                              {member.gameDetails.level ||
                                                "N/A"}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 sm:py-8">
                              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-400 text-sm sm:text-base">
                                No teams joined yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-[80vh] overflow-y-auto rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-600/50">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 p-4 sm:p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-1 sm:p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
                      <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    Edit Player
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-1 sm:p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-all duration-200 cursor-pointer"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Role Management */}
                <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                    <h4 className="text-base sm:text-lg font-semibold text-white">
                      Role Management
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                    >
                      <option value="player">Player</option>
                      <option value="room_host">Room Host</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={handleUpdateRole}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                    >
                      <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                      Update Role
                    </button>
                  </div>
                </div>

                {/* Verification Management */}
                <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <h4 className="text-base sm:text-lg font-semibold text-white">
                      Verification Status
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.isVerified}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            isVerified: e.target.checked,
                          })
                        }
                        className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500/20 focus:ring-2"
                      />
                      <span className="text-white font-medium text-sm sm:text-base">
                        User is verified
                      </span>
                    </label>
                    <button
                      onClick={handleVerify}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      Update Verification
                    </button>
                  </div>
                </div>

                {/* Password Reset */}
                <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    <h4 className="text-base sm:text-lg font-semibold text-white">
                      Password Reset
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={editForm.newPassword}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-3 sm:px-4 py-2 sm:py-3 placeholder-gray-400 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                    />
                    <button
                      onClick={handleResetPassword}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                    >
                      <Key className="h-4 w-4 sm:h-5 sm:w-5" />
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ban Modal */}
        {showBanModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-600/50">
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 p-4 sm:p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Ban Reason</h3>
                  <button
                    onClick={() => setShowBanModal(false)}
                    className="p-1 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Enter ban reason (optional)"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBanModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBan}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Confirm Ban
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-600/50">
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 p-4 sm:p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Confirm Delete
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-1 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <p className="text-gray-300">
                  Are you sure you want to delete this user?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersContent;
