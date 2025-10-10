import {
  X,
  Trophy,
  Users,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  User,
  Crown,
} from "lucide-react";
import { useGetTournamentByIdQuery } from "../../features/api/tournamentApi";

const TournamentDetailsModal = ({ tournamentId, onClose }) => {
  const {
    data: tournament,
    isLoading,
    error,
  } = useGetTournamentByIdQuery(tournamentId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900/95 rounded-2xl p-8 border border-gray-700/50">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="text-white text-lg">
              Loading tournament details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
          <div className="text-red-400 text-lg font-semibold text-center">
            Error: {error.data?.message || error.message}
          </div>
        </div>
      </div>
    );
  }

  const tournamentData = tournament.tournament;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 p-6 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {tournamentData.name}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      tournamentData.isActive
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tournamentData.isActive ? "bg-red-400" : "bg-yellow-400"
                      }`}
                    ></div>
                    {tournamentData.isActive ? "Live Tournament" : "Pending"}
                  </span>
                  <span className="text-gray-400 capitalize">
                    {tournamentData.tournamentType}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Tournament Info Card */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-400" />
              Tournament Details
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <div>
                  <span className="text-gray-400">Map:</span>
                  <span className="text-white font-medium ml-2 capitalize">
                    {tournamentData.mapName}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-400" />
                <div>
                  <span className="text-gray-400">Max Players:</span>
                  <span className="text-white font-medium ml-2">
                    {tournamentData.maxSlots}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                <div>
                  <span className="text-gray-400">Entry Fee:</span>
                  <span className="text-white font-medium ml-2">
                    ${tournamentData.entryFee}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              Schedule
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-400" />
                <div>
                  <span className="text-gray-400">Start Date:</span>
                  <span className="text-white font-medium ml-2">
                    {new Date(tournamentData.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-400" />
                <div>
                  <span className="text-gray-400">Start Time:</span>
                  <span className="text-white font-medium ml-2">
                    {tournamentData.startTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-red-400" />
                <div>
                  <span className="text-gray-400">Registration Ends:</span>
                  <span className="text-white font-medium ml-2">
                    {new Date(
                      tournamentData.registrationEndTime
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prize Pool Section */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-xl p-6 border border-yellow-500/20 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-6 w-6 text-yellow-400" />
            <h4 className="text-xl font-bold text-yellow-400">
              Prize Pool: ${tournamentData.totalPrizePool}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(tournamentData.prizeDistribution)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([position, amount], index) => (
                <div
                  key={position}
                  className={`p-4 rounded-xl border-2 ${
                    position === "1"
                      ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                      : position === "2"
                      ? "bg-gray-400/10 border-gray-400/30 text-gray-300"
                      : position === "3"
                      ? "bg-orange-600/10 border-orange-600/30 text-orange-400"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">#{position}</div>
                    <div className="text-lg font-semibold">${amount}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Host Info */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-400" />
            Tournament Host
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">
                {tournamentData.host.username}
              </div>
              <div className="text-gray-400">{tournamentData.host.email}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailsModal;
