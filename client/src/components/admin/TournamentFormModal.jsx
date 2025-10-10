import {
  Plus,
  Trash2,
  X,
  Trophy,
  Calendar,
  DollarSign,
  Users,
  Map,
  Clock,
} from "lucide-react";

const TournamentFormModal = ({
  title,
  isOpen,
  onClose,
  formData,
  prizeEntries,
  onInputChange,
  onPrizeEntryChange,
  onAddPrizeEntry,
  onRemovePrizeEntry,
  onSubmit,
  isLoading,
  buttonText,
}) => {
  if (!isOpen) return null;

  const totalPrizeAllocated = prizeEntries.reduce(
    (sum, entry) => sum + (parseFloat(entry.amount) || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl animate-slideUp">
        {/* Header with gradient background */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Trophy className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Tournament Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <Trophy className="h-4 w-4 text-orange-400" />
              Tournament Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter tournament name"
              value={formData.name}
              onChange={onInputChange}
              className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
              required
            />
          </div>

          {/* Tournament Type and Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Users className="h-4 w-4 text-orange-400" />
                Tournament Type
              </label>
              <select
                name="tournamentType"
                value={formData.tournamentType}
                onChange={onInputChange}
                className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                required
              >
                <option value="">Select Type</option>
                <option value="solo">🏆 Solo</option>
                <option value="duo">👥 Duo</option>
                <option value="squad">🎯 Squad</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Map className="h-4 w-4 text-orange-400" />
                Map Name
              </label>
              <select
                name="mapName"
                value={formData.mapName}
                onChange={onInputChange}
                className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                required
              >
                <option value="">Select Map</option>
                <option value="bermuda">🏝️ Bermuda</option>
                <option value="kalahari">🏜️ Kalahari</option>
                <option value="purgatory">🔥 Purgatory</option>
                <option value="nexterra">🌌 Nexterra</option>
                <option value="alpine">🏔️ Alpine</option>
              </select>
            </div>
          </div>

          {/* Entry Fee and Prize Pool */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <DollarSign className="h-4 w-4 text-green-400" />
                Entry Fee
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  name="entryFee"
                  placeholder="0"
                  value={formData.entryFee}
                  onChange={onInputChange}
                  className="w-full p-4 pl-8 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Trophy className="h-4 w-4 text-yellow-400" />
                Total Prize Pool
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  name="totalPrizePool"
                  placeholder="0"
                  value={formData.totalPrizePool}
                  onChange={onInputChange}
                  className="w-full p-4 pl-8 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Prize Distribution */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <Trophy className="h-4 w-4 text-orange-400" />
              Prize Distribution
            </label>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="space-y-4">
                {prizeEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-end p-4 bg-gray-800/40 rounded-lg border border-gray-700/30 hover:border-orange-400/30 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        placeholder="1"
                        value={entry.position}
                        onChange={(e) =>
                          onPrizeEntryChange(index, "position", e.target.value)
                        }
                        className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all duration-200"
                      />
                    </div>
                    <div className="flex-2">
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Prize Amount ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 font-semibold text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="1000"
                          value={entry.amount}
                          onChange={(e) =>
                            onPrizeEntryChange(index, "amount", e.target.value)
                          }
                          className="w-full p-3 pl-7 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all duration-200"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemovePrizeEntry(index)}
                      disabled={prizeEntries.length <= 1}
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={onAddPrizeEntry}
                  className="w-full p-4 border-2 border-dashed border-gray-600 hover:border-orange-400/70 rounded-lg text-gray-400 hover:text-orange-400 transition-all duration-200 flex items-center justify-center gap-3 hover:bg-orange-500/5 cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                  Add Prize Position
                </button>
                <div className="flex items-center justify-between mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-400/20">
                  <span className="text-sm font-medium text-gray-300">
                    Total Prize Allocated:
                  </span>
                  <span className="text-lg font-bold text-yellow-400">
                    ${totalPrizeAllocated.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tournament Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Users className="h-4 w-4 text-blue-400" />
                Max Slots
              </label>
              <input
                type="number"
                name="maxSlots"
                placeholder="0"
                value={formData.maxSlots}
                onChange={onInputChange}
                className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Calendar className="h-4 w-4 text-purple-400" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={onInputChange}
                className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Clock className="h-4 w-4 text-purple-400" />
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={onInputChange}
                className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Registration End Time */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <Clock className="h-4 w-4 text-red-400" />
              Registration End Time
            </label>
            <input
              type="datetime-local"
              name="registrationEndTime"
              value={formData.registrationEndTime}
              onChange={onInputChange}
              className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-200"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSubmit(e);
              }}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/25 transform hover:scale-[1.02] disabled:hover:scale-100 cursor-pointer"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <Trophy className="h-5 w-5" />
              )}
              {isLoading ? "Processing..." : buttonText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50 transform hover:scale-[1.02] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentFormModal;
