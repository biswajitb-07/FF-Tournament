import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Zap,
  Trophy,
  Crown,
  Target,
  AlertCircle,
  CheckCircle,
  Loader2,
  Star,
  Award,
} from "lucide-react";
import { FaFire } from "react-icons/fa";
import {
  useGetTournamentsQuery,
  useJoinTournamentMutation,
} from "../../features/api/tournamentApi";
import { useGetMyTeamsQuery } from "../../features/api/teamApi";
import { useGetWalletBalanceQuery } from "../../features/api/walletApi";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/Loader/LoadingSpinner";

const TournamentCard = ({ tournament, myTeams }) => {
  const [joinTournament, { isLoading: isJoining }] =
    useJoinTournamentMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const { data: balanceData } = useGetWalletBalanceQuery();
  const balance = balanceData?.balance || 0;

  const {
    _id,
    name,
    tournamentType,
    mapName,
    startDate,
    startTime,
    totalPrizePool,
    status,
    currentSlots,
    maxSlots,
    entryFee,
  } = tournament;

  const getStatusColor = (status) => {
    const statusMap = {
      upcoming: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500",
      registration_open:
        "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500",
      registration_closed:
        "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500",
      live: "bg-gradient-to-r from-red-500 via-pink-500 to-purple-500",
      completed: "bg-gradient-to-r from-slate-600 via-slate-500 to-slate-400",
      cancelled: "bg-gradient-to-r from-red-600 via-red-500 to-red-400",
    };
    return statusMap[status] || "bg-gradient-to-r from-gray-500 to-gray-700";
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      upcoming: <Star className="h-4 w-4" />,
      registration_open: <FaFire className="h-4 w-4" />,
      registration_closed: <AlertCircle className="h-4 w-4" />,
      live: <Zap className="h-4 w-4 animate-pulse" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <AlertCircle className="h-4 w-4" />,
    };
    return statusMap[status] || <AlertCircle className="h-4 w-4" />;
  };

  const getTypeInfo = (type, maxSlots) => {
    switch (type) {
      case "solo":
        return {
          players: maxSlots,
          teams: null,
          icon: <Target className="h-5 w-5" />,
          gradient: "from-blue-500 to-cyan-500",
        };
      case "duo":
        return {
          players: maxSlots * 2,
          teams: maxSlots,
          icon: <Users className="h-5 w-5" />,
          gradient: "from-purple-500 to-pink-500",
        };
      case "squad":
        return {
          players: maxSlots * 4,
          teams: maxSlots,
          icon: <Users className="h-5 w-5" />,
          gradient: "from-green-500 to-emerald-500",
        };
      default:
        return {
          players: 0,
          teams: null,
          icon: null,
          gradient: "from-gray-500 to-gray-600",
        };
    }
  };

  const typeInfo = getTypeInfo(tournamentType, maxSlots);
  const formattedDate = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = startTime;

  let buttonText = "VIEW DETAILS";
  let buttonDisabled = false;
  if (status === "registration_open") {
    buttonText = "JOIN NOW";
    buttonDisabled = false;
  } else if (status === "upcoming") {
    buttonText = "UPCOMING";
    buttonDisabled = true;
  } else if (status === "registration_closed") {
    buttonText = "REGISTRATION CLOSED";
    buttonDisabled = true;
  } else if (status === "live") {
    buttonText = "VIEW LIVE";
    buttonDisabled = false;
  } else if (status === "completed") {
    buttonText = "VIEW REPLAY";
    buttonDisabled = false;
  } else if (status === "cancelled") {
    buttonText = "CANCELLED";
    buttonDisabled = true;
  }

  const handleJoinClick = () => {
    if (buttonText === "JOIN NOW" && !isJoining) {
      setIsDialogOpen(true);
    }
  };

  const handlePayAndJoin = async () => {
    if (isJoining) return;

    try {
      let teamId = undefined;
      if (tournamentType !== "solo" && !selectedTeam) {
        toast.error("Please select a team to continue!");
        return;
      }
      if (tournamentType !== "solo") {
        teamId = selectedTeam;
      }

      const response = await joinTournament({ id: _id, teamId }).unwrap();
      toast.success(
        response.message || "🎉 Successfully joined the tournament!"
      );
      setIsDialogOpen(false);
      setSelectedTeam(null);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "❌ Failed to join tournament. Please try again."
      );
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTeam(null);
  };

  const eligibleTeams = myTeams.filter(
    (team) => team.teamType === tournamentType
  );

  const hasSufficientBalance = balance >= entryFee;

  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDialogOpen]);

  return (
    <>
      <div className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 overflow-hidden">
        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(
            status
          )}`}
        >
          {getStatusIcon(status)}
          <span>{status.replace("_", " ").toUpperCase()}</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`bg-gradient-to-br ${typeInfo.gradient} p-2 rounded-lg`}
          >
            {typeInfo.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white truncate">{name}</h3>
            <p className="text-xs text-gray-400">
              {tournamentType.toUpperCase()} • {typeInfo.players} Players
            </p>
          </div>
        </div>

        {/* Map & Date Time */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-orange-400">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{mapName.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="h-4 w-4" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock className="h-4 w-4" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Slots & Prize */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="h-4 w-4" />
              <span>Slots</span>
            </div>
            <span className="text-white font-medium">
              {currentSlots}/{maxSlots}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span className="text-lg font-bold text-yellow-400">
                ₹{totalPrizePool.toLocaleString()}
              </span>
            </div>
            {entryFee > 0 && (
              <span className="text-sm text-gray-400">
                Fee: ₹{entryFee.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer ${
            buttonDisabled || isJoining
              ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white hover:shadow-lg"
          }`}
          onClick={handleJoinClick}
          disabled={buttonDisabled || isJoining}
        >
          {isJoining ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>JOINING...</span>
            </>
          ) : (
            <>
              <span>{buttonText}</span>
              {!buttonDisabled && <Crown className="h-4 w-4" />}
            </>
          )}
        </button>

        {/* Subtle Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl pointer-events-none"></div>
      </div>

      {/* Enhanced Dialog for Team Selection */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-600/50 shadow-2xl">
            {/* Dialog Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
                <Trophy className="h-4 w-4" />
                <span>JOIN TOURNAMENT</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{name}</h3>
            </div>

            {/* Entry Fee Display */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Entry Fee:</span>
                <span className="text-xl font-bold text-white">
                  {entryFee === 0 ? "FREE" : `₹${entryFee.toLocaleString()}`}
                </span>
              </div>
              {entryFee > 0 && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/50">
                  <span className="text-gray-400">Your Balance:</span>
                  <span
                    className={`font-bold ${
                      hasSufficientBalance ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    ₹{balance.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Insufficient Balance Warning */}
            {!hasSufficientBalance && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-red-300 font-medium">
                    Insufficient balance. Please add funds to your wallet.
                  </p>
                </div>
              </div>
            )}

            {/* Team Selection */}
            {tournamentType !== "solo" ? (
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-medium">
                  Select Team:
                </label>
                {eligibleTeams.length > 0 ? (
                  <select
                    className="w-full bg-slate-700 text-white rounded-xl p-3 border border-slate-600 focus:border-orange-400 focus:outline-none transition-colors cursor-pointer"
                    value={selectedTeam || ""}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    <option value="">Choose your team</option>
                    {eligibleTeams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.teamName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300">
                      No eligible {tournamentType} teams found. Please create a
                      team first.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  <p className="text-blue-300">
                    Solo tournament: No team selection required.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-600/50 hover:bg-gray-500/50 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer"
                onClick={handleCloseDialog}
                disabled={isJoining}
              >
                Cancel
              </button>
              <button
                className={`font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isJoining ||
                  (tournamentType !== "solo" && !selectedTeam) ||
                  !hasSufficientBalance
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white shadow-lg"
                }`}
                onClick={handlePayAndJoin}
                disabled={
                  isJoining ||
                  (tournamentType !== "solo" && !selectedTeam) ||
                  !hasSufficientBalance
                }
              >
                {isJoining ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    {entryFee === 0 ? "Join for Free" : "Pay and Join"}
                    <Crown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Tournaments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { data: tournamentsData, isLoading: tournamentsLoading } =
    useGetTournamentsQuery();
  const { data: teamsData, isLoading: teamsLoading } = useGetMyTeamsQuery();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (tournamentsLoading || teamsLoading) {
    return <LoadingSpinner />;
  }

  const tournaments = tournamentsData?.tournaments || [];
  const myTeams = teamsData
    ? [...teamsData.duoTeams, ...teamsData.squadTeams]
    : [];

  const filteredTournaments = tournaments.filter((t) => {
    if (activeTab === "upcoming")
      return ["upcoming", "registration_open", "registration_closed"].includes(
        t.status
      );
    if (activeTab === "ongoing") return t.status === "live";
    if (activeTab === "past")
      return ["completed", "cancelled"].includes(t.status);
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white relative overflow-hidden pt-[2rem] lg:pt-[5rem]">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl animate-bounce delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-6 py-3 rounded-full text-sm font-bold mb-6 animate-pulse shadow-lg border border-white/20">
              <FaFire className="h-5 w-5 animate-bounce" />
              <span className="tracking-wider">EPIC BATTLES AWAIT</span>
              <FaFire className="h-5 w-5 animate-bounce" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-black mb-6 bg-gradient-to-r from-orange-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent leading-tight">
              TOURNAMENT
              <br />
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                ARENA
              </span>
            </h1>
            <p className="text-sm lg:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Join the ultimate Free FaFire showdowns. Battle against the best
              players, showcase your skills, and claim your spot in gaming
              history with massive prizes waiting for champions.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-4 border border-orange-400/30">
                <Trophy className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-orange-300">
                  Active Tournaments
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-400/30">
                <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-purple-300">Active Players</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl p-4 border border-yellow-400/30">
                <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">₹50L+</div>
                <div className="text-sm text-yellow-300">Prize Pool</div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex justify-center">
            <div className="bg-slate-800/50 rounded-2xl p-2 backdrop-blur-sm border border-gray-600/30">
              {["upcoming", "ongoing", "past"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 mx-1 rounded-xl font-bold transition-all duration-300 transform cursor-pointer relative overflow-hidden ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white shadow-xl scale-105 border border-orange-400/50"
                      : "text-gray-400 hover:text-white hover:bg-slate-700/50 hover:scale-105"
                  }`}
                >
                  {activeTab === tab && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] animate-pulse"></div>
                  )}
                  <span className="relative z-10 tracking-wide">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="relative z-0">
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTournaments.map((tournament, index) => (
              <div
                key={tournament._id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TournamentCard tournament={tournament} myTeams={myTeams} />
              </div>
            ))}
          </div>

          {/* Enhanced No Tournaments Message */}
          {filteredTournaments.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 rounded-3xl p-12 max-w-md mx-auto backdrop-blur-sm border border-gray-600/30">
                <Trophy className="h-20 w-20 text-gray-500 mx-auto mb-6 animate-pulse" />
                <h3 className="text-3xl font-black text-gray-300 mb-4">
                  No {activeTab} Tournaments
                </h3>
                <p className="text-gray-400 mb-6">
                  Check back soon for exciting battles and epic prizes!
                </p>
                <div className="flex justify-center">
                  <button
                    className="bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Footer CTA */}
      <div className="relative z-0 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 py-16 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-8 left-1/4 w-4 h-4 bg-orange-400 rounded-full animate-ping"></div>
            <div className="absolute top-12 right-1/3 w-3 h-3 bg-red-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-8 left-1/3 w-5 h-5 bg-yellow-400 rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-yellow-400/30">
              <Star className="h-4 w-4 text-yellow-400 animate-spin" />
              <span className="text-yellow-300">BE A CHAMPION</span>
              <Star className="h-4 w-4 text-yellow-400 animate-spin" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Ready to Battle?
            </h2>

            <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Don't miss your chance to compete for glory and massive prizes.
              <span className="block text-orange-300 font-bold mt-2">
                The arena awaits your legend!
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 hover:from-orange-500 hover:via-red-500 hover:to-orange-400 text-white font-black py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-orange-500/30 cursor-pointer uppercase tracking-wider text-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <Crown className="h-6 w-6 animate-bounce" />
                  <span>Play Tournament Win Prize</span>
                  <FaFire className="h-6 w-6 animate-pulse" />
                </div>
              </button>

              <div className="flex items-center gap-4 text-gray-400">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
                <div className="w-px h-12 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm">Secure</div>
                </div>
                <div className="w-px h-12 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Instant</div>
                  <div className="text-sm">Payouts</div>
                </div>
              </div>
            </div>

            {/* Additional CTA Elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-400/20">
                <Target className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">
                  Solo Battles
                </h4>
                <p className="text-sm text-blue-300">
                  Prove your individual skills
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-400/20">
                <Users className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">
                  Team Fights
                </h4>
                <p className="text-sm text-purple-300">
                  Coordinate with your squad
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl p-6 border border-yellow-400/20">
                <Award className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">
                  Big Rewards
                </h4>
                <p className="text-sm text-yellow-300">Win amazing prizes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Tournaments;
