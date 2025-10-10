import { useState, useEffect } from "react";
import {
  useGetMyTeamsQuery,
  useGetPendingInvitesQuery,
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useUpdateTeamLogoMutation,
  useJoinTeamMutation,
  useUpdateTeamMutation,
  useAcceptJoinRequestMutation,
  useRejectJoinRequestMutation,
  useUserAcceptInviteMutation,
  useUserRejectInviteMutation,
  useRemoveTeamMemberMutation,
  useInviteByGameIdMutation,
  useLeaveTeamMutation,
  useGetTeamDetailsQuery,
} from "../features/api/teamApi";
import { toast } from "react-hot-toast";
import {
  Users,
  Plus,
  Key,
  Send,
  X,
  Trash2,
  Image,
  Check,
  Edit2,
  Eye,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
} from "lucide-react";
import ButtonLoader from "./Loader/ButtonLoader";

const TeamManagement = ({ userId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPendingInvitesModal, setShowPendingInvitesModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamForInvite, setSelectedTeamForInvite] = useState(null);
  const [selectedTeamForLeave, setSelectedTeamForLeave] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [updateTeamName, setUpdateTeamName] = useState("");
  const [teamType, setTeamType] = useState("squad");
  const [inviteCode, setInviteCode] = useState("");
  const [gameIdInput, setGameIdInput] = useState("");
  const [selectedTeamForLogo, setSelectedTeamForLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [acceptingInvites, setAcceptingInvites] = useState(new Set());
  const [rejectingInvites, setRejectingInvites] = useState(new Set());

  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    refetch: refetchTeams,
  } = useGetMyTeamsQuery();
  const {
    data: pendingInvitesData,
    isLoading: isLoadingInvites,
    refetch: refetchInvites,
  } = useGetPendingInvitesQuery();
  const { data: teamDetails, isLoading: isLoadingDetails } =
    useGetTeamDetailsQuery(selectedTeamId, { skip: !selectedTeamId });
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();
  const [updateTeamLogo, { isLoading: isUploading }] =
    useUpdateTeamLogoMutation();
  const [joinTeam, { isLoading: isJoining }] = useJoinTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [acceptJoinRequest, { isLoading: isAccepting }] =
    useAcceptJoinRequestMutation();
  const [rejectJoinRequest, { isLoading: isRejecting }] =
    useRejectJoinRequestMutation();
  const [userAcceptInvite, { isLoading: isUserAccepting }] =
    useUserAcceptInviteMutation();
  const [userRejectInvite, { isLoading: isUserRejecting }] =
    useUserRejectInviteMutation();
  const [removeTeamMember, { isLoading: isRemoving }] =
    useRemoveTeamMemberMutation();
  const [inviteByGameId, { isLoading: isInviting }] =
    useInviteByGameIdMutation();
  const [leaveTeam, { isLoading: isLeaving }] = useLeaveTeamMutation();

  const duoTeams = teamsData?.duoTeams || [];
  const squadTeams = teamsData?.squadTeams || [];
  const duoCount = teamsData?.duoCount || 0;
  const squadCount = teamsData?.squadCount || 0;
  const pendingInvites = pendingInvitesData?.invites || [];
  const pendingInvitesCount = pendingInvitesData?.count || 0;

  const getCurrentMembersCount = (teamMembers) => {
    if (!teamMembers || teamMembers.length === 0) return 0;
    const acceptedMembers = teamMembers.filter(
      (member) => member.status === "accepted"
    );
    return acceptedMembers.length;
  };

  const getMaxMembers = (teamType) => {
    return teamType === "duo" ? 2 : 4;
  };

  useEffect(() => {
    const modalsOpen =
      showCreateForm ||
      showJoinForm ||
      showUpdateForm ||
      showDeleteDialog ||
      showLeaveDialog ||
      showTeamDetailsModal ||
      selectedTeamForLogo ||
      showInviteModal ||
      showPendingInvitesModal;

    if (modalsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    showCreateForm,
    showJoinForm,
    showUpdateForm,
    showDeleteDialog,
    showLeaveDialog,
    showTeamDetailsModal,
    selectedTeamForLogo,
    showInviteModal,
    showPendingInvitesModal,
  ]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchTeams(), refetchInvites()]);
      toast.success("Data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam({ teamName, teamType }).unwrap();
      toast.success("Team created successfully!");
      closeAllModals();
      setTeamName("");
      setTeamType("squad");
      await refetchTeams();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create team");
    }
  };

  const handleUpdateTeam = async (e, teamId) => {
    e.preventDefault();
    try {
      await updateTeam({ teamId, teamName: updateTeamName }).unwrap();
      toast.success("Team updated successfully!");
      closeAllModals();
      setUpdateTeamName("");
      await refetchTeams();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update team");
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    try {
      await joinTeam({ inviteCode }).unwrap();
      toast.success("Join request sent!");
      closeAllModals();
      setInviteCode("");
      await Promise.all([refetchTeams(), refetchInvites()]);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send join request");
    }
  };

  const handleUserAcceptInvite = async (teamId) => {
    setAcceptingInvites((prev) => new Set([...prev, teamId]));
    try {
      await userAcceptInvite({ teamId }).unwrap();
      toast.success("Invite accepted!");
      setShowPendingInvitesModal(false);
      await Promise.all([refetchInvites(), refetchTeams()]);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to accept invite");
    } finally {
      setAcceptingInvites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });
    }
  };

  const handleUserRejectInvite = async (teamId) => {
    setRejectingInvites((prev) => new Set([...prev, teamId]));
    try {
      await userRejectInvite({ teamId }).unwrap();
      toast.success("Invite rejected!");
      setShowPendingInvitesModal(false);
      await refetchInvites();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject invite");
    } finally {
      setRejectingInvites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });
    }
  };

  const handleInviteByGameId = async (e, teamId) => {
    e.preventDefault();
    if (!gameIdInput.trim()) {
      toast.error("Please enter a Game ID");
      return;
    }
    try {
      await inviteByGameId({ teamId, gameId: gameIdInput.trim() }).unwrap();
      toast.success("Invite sent successfully!");
      closeAllModals();
      setGameIdInput("");
      await Promise.all([refetchTeams(), refetchInvites()]);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send invite");
    }
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      await leaveTeam({ teamId }).unwrap();
      toast.success("Left team successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to leave team");
      return;
    }
    closeAllModals();
    setSelectedTeamId(null);
    try {
      await refetchTeams();
    } catch (refetchError) {
      console.error("Failed to refetch teams after leaving:", refetchError);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeam(teamId).unwrap();
      toast.success("Team deleted successfully!");
      closeAllModals();
      await refetchTeams();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete team");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoUpload = async (teamId) => {
    if (!logoFile) {
      toast.error("Please select a logo file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("teamLogo", logoFile);
      await updateTeamLogo({ teamId, formData }).unwrap();
      toast.success("Team logo updated!");
      closeAllModals();
      setLogoFile(null);
      setLogoPreview("");
      await refetchTeams();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update logo");
    }
  };

  const openUpdateForm = (team) => {
    setShowUpdateForm(team._id);
    setUpdateTeamName(team.teamName);
  };

  const openInviteModal = (teamId) => {
    setSelectedTeamForInvite(teamId);
    setShowInviteModal(true);
  };

  const openPendingInvitesModal = () => {
    setShowPendingInvitesModal(true);
  };

  const viewPendingInviteDetails = (teamId) => {
    setSelectedTeamId(teamId);
    setShowTeamDetailsModal(true);
  };

  const openLeaveDialog = (teamId) => {
    setSelectedTeamForLeave(teamId);
    setShowLeaveDialog(true);
  };

  const handleAcceptRequest = async (teamId, userId) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }
    try {
      await acceptJoinRequest({ teamId, userId }).unwrap();
      toast.success("Request accepted!");
      await Promise.all([refetchTeams(), refetchInvites()]);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (teamId, userId) => {
    if (!userId) {
      toast.error("Invalid user ID",);
      return;
    }
    try {
      await rejectJoinRequest({ teamId, userId }).unwrap();
      toast.success("Request rejected!");
      await Promise.all([refetchTeams(), refetchInvites()]);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject request");
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!userId) {
      toast.error("Cannot remove member: Invalid user ID");
      return;
    }
    try {
      await removeTeamMember({ teamId, userId }).unwrap();
      toast.success("Member removed!");
      await refetchTeams();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove member");
    }
  };

  const handleViewTeam = (teamId) => {
    setSelectedTeamId(teamId);
    setShowTeamDetailsModal(true);
  };

  const closeAllModals = () => {
    setShowCreateForm(false);
    setShowJoinForm(false);
    setShowUpdateForm(null);
    setShowDeleteDialog(null);
    setShowLeaveDialog(false);
    setShowTeamDetailsModal(false);
    setSelectedTeamForLogo(null);
    setShowInviteModal(false);
    setSelectedTeamForInvite(null);
    setShowPendingInvitesModal(false);
    setSelectedTeamId(null);
    setSelectedTeamForLeave(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAllModals();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        closeAllModals();
      }
    };

    if (
      showCreateForm ||
      showJoinForm ||
      showUpdateForm ||
      showDeleteDialog ||
      showLeaveDialog ||
      showTeamDetailsModal ||
      selectedTeamForLogo ||
      showInviteModal ||
      showPendingInvitesModal
    ) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [
    showCreateForm,
    showJoinForm,
    showUpdateForm,
    showDeleteDialog,
    showLeaveDialog,
    showTeamDetailsModal,
    selectedTeamForLogo,
    showInviteModal,
    showPendingInvitesModal,
  ]);

  if (isLoadingTeams && !isRefreshing)
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p>Loading teams...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Team Management
          </h2>
          <p className="text-gray-400">
            Create, manage, and join teams for competitions
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Team</span>
          </button>
          <button
            onClick={() => setShowJoinForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <Key className="w-5 h-5" />
            <span className="font-medium">Join Team</span>
          </button>
          {pendingInvitesCount > 0 && (
            <button
              onClick={openPendingInvitesModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer relative"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">
                Invites ({pendingInvitesCount})
              </span>
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Duo Teams Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white">
            Duo Teams ({duoCount}/2)
          </h3>
        </div>
        {duoTeams.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No duo teams found</p>
            <p className="text-gray-500 text-sm mt-2">
              Create your first duo team to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {duoTeams.map((team) => {
              const currentMembers = getCurrentMembersCount(team.members);
              const maxMembers = getMaxMembers(team.teamType);
              const isLeader = team.leader?._id === userId;
              const hasJoinRequests = team.members.some(
                (m) => m.status === "pending" && m.memberType === "join_request"
              );
              return (
                <div
                  key={team._id}
                  className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {team.teamLogo ? (
                      <img
                        src={team.teamLogo}
                        alt={team.teamName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {team.teamName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg">
                        {team.teamName}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Code:{" "}
                        <span className="font-mono bg-gray-700 px-2 py-1 rounded">
                          {team.inviteCode}
                        </span>
                      </p>
                      <p className="text-gray-400 text-sm flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {currentMembers}/{maxMembers} Members
                        </span>
                        {currentMembers === maxMembers && (
                          <span className="text-green-400 ml-1">• Full</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Pending Join Requests - Leader only */}
                  {isLeader && hasJoinRequests && (
                    <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                      <h5 className="text-yellow-400 text-sm font-semibold mb-2">
                        Pending Requests (
                        {
                          team.members.filter(
                            (m) =>
                              m.status === "pending" &&
                              m.memberType === "join_request"
                          ).length
                        }
                        )
                      </h5>
                      {team.members
                        .filter(
                          (m) =>
                            m.status === "pending" &&
                            m.memberType === "join_request"
                        )
                        .map((member) => (
                          <div
                            key={member.user?._id || `pending-${member.user}`}
                            className="flex items-center justify-between space-x-2 py-2"
                          >
                            <span className="text-gray-300 text-sm font-medium">
                              {member.user?.username || member.user}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleAcceptRequest(
                                    team._id,
                                    member.user?._id || member.user
                                  )
                                }
                                disabled={isAccepting}
                                className="flex items-center space-x-1 text-green-400 hover:text-green-300 bg-green-900/30 hover:bg-green-900/50 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                              >
                                {isAccepting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <UserCheck className="w-4 h-4" />
                                )}
                                <span className="text-xs font-medium">
                                  Accept
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectRequest(
                                    team._id,
                                    member.user?._id || member.user
                                  )
                                }
                                disabled={isRejecting}
                                className="flex items-center space-x-1 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                              >
                                {isRejecting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <UserX className="w-4 h-4" />
                                )}
                                <span className="text-xs font-medium">
                                  Reject
                                </span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {isLeader ? (
                      <>
                        <button
                          onClick={() => openUpdateForm(team)}
                          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => setSelectedTeamForLogo(team._id)}
                          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 bg-purple-900/30 hover:bg-purple-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Image className="w-4 h-4" />
                          <span className="text-sm font-medium">Logo</span>
                        </button>
                        <button
                          onClick={() => openInviteModal(team._id)}
                          className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">Invite</span>
                        </button>
                        <button
                          onClick={() => setShowDeleteDialog(team._id)}
                          className="flex items-center space-x-1 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </>
                    ) : null}
                    <button
                      onClick={() => handleViewTeam(team._id)}
                      className="flex items-center space-x-1 text-green-400 hover:text-green-300 bg-green-900/30 hover:bg-green-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">View</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Squad Teams Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white">
            Squad Teams ({squadCount}/2)
          </h3>
        </div>
        {squadTeams.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No squad teams found</p>
            <p className="text-gray-500 text-sm mt-2">
              Create your first squad team to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {squadTeams.map((team) => {
              const currentMembers = getCurrentMembersCount(team.members);
              const maxMembers = getMaxMembers(team.teamType);
              const isLeader = team.leader?._id === userId;
              const hasJoinRequests = team.members.some(
                (m) => m.status === "pending" && m.memberType === "join_request"
              );
              return (
                <div
                  key={team._id}
                  className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {team.teamLogo ? (
                      <img
                        src={team.teamLogo}
                        alt={team.teamName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {team.teamName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg">
                        {team.teamName}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Code:{" "}
                        <span className="font-mono bg-gray-700 px-2 py-1 rounded">
                          {team.inviteCode}
                        </span>
                      </p>
                      <p className="text-gray-400 text-sm flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {currentMembers}/{maxMembers} Members
                        </span>
                        {currentMembers === maxMembers && (
                          <span className="text-green-400 ml-1">• Full</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Pending Join Requests - Leader only */}
                  {isLeader && hasJoinRequests && (
                    <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                      <h5 className="text-yellow-400 text-sm font-semibold mb-2">
                        Pending Requests (
                        {
                          team.members.filter(
                            (m) =>
                              m.status === "pending" &&
                              m.memberType === "join_request"
                          ).length
                        }
                        )
                      </h5>
                      {team.members
                        .filter(
                          (m) =>
                            m.status === "pending" &&
                            m.memberType === "join_request"
                        )
                        .map((member) => (
                          <div
                            key={member.user?._id || `pending-${member.user}`}
                            className="flex items-center justify-between space-x-2 py-2"
                          >
                            <span className="text-gray-300 text-sm font-medium">
                              {member.user?.username || member.user}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleAcceptRequest(
                                    team._id,
                                    member.user?._id || member.user
                                  )
                                }
                                disabled={isAccepting}
                                className="flex items-center space-x-1 text-green-400 hover:text-green-300 bg-green-900/30 hover:bg-green-900/50 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                              >
                                {isAccepting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <UserCheck className="w-4 h-4" />
                                )}
                                <span className="text-xs font-medium">
                                  Accept
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectRequest(
                                    team._id,
                                    member.user?._id || member.user
                                  )
                                }
                                disabled={isRejecting}
                                className="flex items-center space-x-1 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                              >
                                {isRejecting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <UserX className="w-4 h-4" />
                                )}
                                <span className="text-xs font-medium">
                                  Reject
                                </span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {isLeader ? (
                      <>
                        <button
                          onClick={() => openUpdateForm(team)}
                          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => setSelectedTeamForLogo(team._id)}
                          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 bg-purple-900/30 hover:bg-purple-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Image className="w-4 h-4" />
                          <span className="text-sm font-medium">Logo</span>
                        </button>
                        <button
                          onClick={() => openInviteModal(team._id)}
                          className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">Invite</span>
                        </button>
                        <button
                          onClick={() => setShowDeleteDialog(team._id)}
                          className="flex items-center space-x-1 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </>
                    ) : null}
                    <button
                      onClick={() => handleViewTeam(team._id)}
                      className="flex items-center space-x-1 text-green-400 hover:text-green-300 bg-green-900/30 hover:bg-green-900/50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">View</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Create New Team
              </h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-white mb-2 font-medium">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all duration-200"
                    placeholder="Enter team name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-white mb-2 font-medium">
                    Team Type
                  </label>
                  <select
                    value={teamType}
                    onChange={(e) => setTeamType(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="squad">Squad (4 members)</option>
                    <option value="duo">Duo (2 members)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isCreating ? (
                    <ButtonLoader />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  <span className="font-medium">Create</span>
                </button>
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Join Existing Team
              </h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-white mb-2 font-medium">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 font-mono"
                  placeholder="Enter team invite code"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isJoining}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isJoining ? <ButtonLoader /> : <Send className="w-5 h-5" />}
                  <span className="font-medium">Send Request</span>
                </button>
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* pending invites */}
      {showPendingInvitesModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 sm:p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Pending Invites ({pendingInvitesCount})
              </h3>
              <button
                onClick={() => setShowPendingInvitesModal(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {isLoadingInvites ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : pendingInvites.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-sm sm:text-base">
                  No pending invites
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingInvites.map((invite) => (
                  <div
                    key={invite._id}
                    className="bg-gray-700/50 border border-gray-600 rounded-xl p-4 hover:border-gray-500 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        {invite.teamLogo ? (
                          <img
                            src={invite.teamLogo}
                            alt={invite.teamName}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-purple-500"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {invite.teamName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-semibold text-sm sm:text-base">
                            {invite.teamName}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Invited by: {invite.leader?.username}
                          </p>
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                            {invite.teamType.toUpperCase()} • Pending
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => viewPendingInviteDetails(invite._id)}
                          className="flex items-center space-x-1 text-green-400 hover:text-green-300 bg-green-900/30 hover:bg-green-900/50 px-2 py-1 sm:px-3 sm:py-1 rounded-lg transition-all duration-200 text-xs sm:text-sm cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleUserAcceptInvite(invite._id)}
                          disabled={acceptingInvites.has(invite._id)}
                          className="flex items-center space-x-1 text-green-400 hover:text-green-300 bg-green-900/30 hover:bg-green-900/50 px-2 py-1 sm:px-3 sm:py-1 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
                        >
                          {acceptingInvites.has(invite._id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleUserRejectInvite(invite._id)}
                          disabled={rejectingInvites.has(invite._id)}
                          className="flex items-center space-x-1 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 px-2 py-1 sm:px-3 sm:py-1 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
                        >
                          {rejectingInvites.has(invite._id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserX className="w-4 h-4" />
                          )}
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Update Team Modal */}
      {showUpdateForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Update Team</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => handleUpdateTeam(e, showUpdateForm)}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label className="text-white mb-2 font-medium">Team Name</label>
                <input
                  type="text"
                  value={updateTeamName}
                  onChange={(e) => setUpdateTeamName(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
                  placeholder="Enter new team name"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isUpdating ? (
                    <ButtonLoader />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  <span className="font-medium">Update</span>
                </button>
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logo Upload Modal */}
      {selectedTeamForLogo && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Upload Team Logo
              </h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-white mb-2 font-medium">
                  Select Logo Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                />
                {logoPreview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-purple-500 shadow-lg"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleLogoUpload(selectedTeamForLogo)}
                  disabled={isUploading || !logoFile}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isUploading ? (
                    <ButtonLoader />
                  ) : (
                    <Image className="w-5 h-5" />
                  )}
                  <span className="font-medium">Upload Logo</span>
                </button>
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {showTeamDetailsModal && teamDetails && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {teamDetails.team.teamName}
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full">
                    {teamDetails.team.teamType.toUpperCase()}
                  </span>
                  <span className="text-gray-300">
                    {teamDetails.team.currentMembers}/
                    {teamDetails.team.maxMembers} Members
                  </span>
                </div>
              </div>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamDetails.team.members.map((member, index) => (
                <div
                  key={member._id || `member-${index}`}
                  className="bg-gray-700/50 border border-gray-600 rounded-xl p-4 hover:border-gray-500 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {member.profilePicture ? (
                        <img
                          src={member.profilePicture}
                          alt={member.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-semibold">
                          {member.username}
                        </h4>
                        <p className="text-sm">
                          {member.status === "leader" ? (
                            <span className="text-yellow-400 font-medium">
                              👑 Leader
                            </span>
                          ) : (
                            <span className="text-green-400 font-medium">
                              {member.status}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {teamDetails.team.leader?._id === userId &&
                        member.status !== "leader" && (
                          <button
                            onClick={() =>
                              handleRemoveMember(
                                teamDetails.team._id,
                                member._id
                              )
                            }
                            disabled={isRemoving}
                            className="flex items-center space-x-1 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                            title="Remove member"
                          >
                            {isRemoving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      {member._id === userId && member.status !== "leader" && (
                        <button
                          onClick={() => openLeaveDialog(teamDetails.team._id)}
                          disabled={isLeaving}
                          className="flex items-center space-x-1 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                          title="Leave team"
                        >
                          {isLeaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserX className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Game ID:</span>
                      <span className="text-white font-mono">
                        {member.gameDetails?.gameId || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Level:</span>
                      <span className="text-white font-semibold">
                        {member.gameDetails?.level || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Game Username:</span>
                      <span className="text-white">
                        {member.gameDetails?.gameUsername || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={closeAllModals}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal - Leader only */}
      {showInviteModal && selectedTeamForInvite && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Invite Member by Game ID
              </h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => handleInviteByGameId(e, selectedTeamForInvite)}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label className="text-white mb-2 font-medium">Game ID</label>
                <input
                  type="text"
                  value={gameIdInput}
                  onChange={(e) => setGameIdInput(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 font-mono"
                  placeholder="Enter member's Game ID"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isInviting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isInviting ? <ButtonLoader /> : <Send className="w-5 h-5" />}
                  <span className="font-medium">Send Invite</span>
                </button>
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Team</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this team? This action cannot be
                undone and all team data will be permanently lost.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteTeam(showDeleteDialog)}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:transform-none font-medium"
              >
                {isDeleting ? <ButtonLoader /> : <Trash2 className="w-5 h-5" />}
                <span>Delete Team</span>
              </button>
              <button
                onClick={closeAllModals}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer font-medium"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Confirmation Modal */}
      {showLeaveDialog && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gray-800 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Leave Team</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to leave this team? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleLeaveTeam(selectedTeamForLeave)}
                disabled={isLeaving}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:transform-none font-medium"
              >
                {isLeaving ? <ButtonLoader /> : <UserX className="w-5 h-5" />}
                <span>Leave Team</span>
              </button>
              <button
                onClick={closeAllModals}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer font-medium"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
