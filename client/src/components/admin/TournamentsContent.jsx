import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  Trophy,
  Users,
  DollarSign,
  Settings,
} from "lucide-react";
import {
  useCreateTournamentMutation,
  useGetTournamentsQuery,
  useEditTournamentMutation,
  useDeleteTournamentMutation,
} from "../../features/api/tournamentApi";
import TournamentDetailsModal from "./TournamentDetailsModal";
import TournamentFormModal from "./TournamentFormModal";
import { toast } from "react-hot-toast";

const TournamentsContent = () => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [statusTournamentId, setStatusTournamentId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    tournamentType: "",
    mapName: "",
    entryFee: 0,
    totalPrizePool: 0,
    maxSlots: 0,
    startDate: "",
    startTime: "",
    registrationEndTime: "",
  });
  const [prizeEntries, setPrizeEntries] = useState([
    { position: "1", amount: "" },
    { position: "2", amount: "" },
    { position: "3", amount: "" },
  ]);

  const [createTournament, { isLoading: isCreating }] =
    useCreateTournamentMutation();
  const {
    data: tournaments,
    isLoading: isTournamentsLoading,
    error: tournamentsError,
  } = useGetTournamentsQuery();
  const [editTournament, { isLoading: isEditing }] =
    useEditTournamentMutation();
  const [deleteTournament, { isLoading: isDeleting }] =
    useDeleteTournamentMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrizeEntryChange = (index, field, value) => {
    setPrizeEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addPrizeEntry = () => {
    setPrizeEntries((prev) => [
      ...prev,
      { position: String(prev.length + 1), amount: "" },
    ]);
  };

  const removePrizeEntry = (index) => {
    if (prizeEntries.length > 1) {
      setPrizeEntries((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const buildPrizeDistribution = () => {
    const distribution = {};
    prizeEntries.forEach((entry) => {
      if (entry.position && entry.amount && parseFloat(entry.amount) > 0) {
        distribution[entry.position] = parseFloat(entry.amount);
      }
    });
    return distribution;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      tournamentType: "",
      mapName: "",
      entryFee: 0,
      totalPrizePool: 0,
      maxSlots: 0,
      startDate: "",
      startTime: "",
      registrationEndTime: "",
    });
    setPrizeEntries([
      { position: "1", amount: "" },
      { position: "2", amount: "" },
      { position: "3", amount: "" },
    ]);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const prizeDistribution = buildPrizeDistribution();
      const submitData = {
        ...formData,
        prizeDistribution,
      };

      const result = await createTournament(submitData).unwrap();

      setShowCreateModal(false);
      resetForm();
      toast.success("Tournament created successfully");
    } catch (error) {
      toast.error("Failed to create tournament");
    }
  };

  // Fixed: Separate function for viewing details
  const handleViewDetails = (tournamentId) => {
    setSelectedTournament(tournamentId);
    setShowDetailsModal(true);
  };

  const handleEditClick = (tournament) => {
    setSelectedTournament(tournament._id);
    setFormData({
      name: tournament.name,
      tournamentType: tournament.tournamentType,
      mapName: tournament.mapName,
      entryFee: tournament.entryFee,
      totalPrizePool: tournament.totalPrizePool,
      maxSlots: tournament.maxSlots,
      startDate: tournament.startDate.split("T")[0],
      startTime: tournament.startTime,
      registrationEndTime: new Date(tournament.registrationEndTime)
        .toISOString()
        .slice(0, 16),
    });
    setPrizeEntries(
      Object.entries(tournament.prizeDistribution).map(
        ([position, amount]) => ({
          position,
          amount: String(amount),
        })
      )
    );
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const prizeDistribution = buildPrizeDistribution();
      const submitData = {
        ...formData,
        prizeDistribution,
      };

      await editTournament({
        id: selectedTournament,
        data: submitData,
      }).unwrap();

      setShowEditModal(false);
      resetForm();
      setSelectedTournament(null);
      toast.success("Tournament updated successfully");
    } catch (error) {
      toast.error("Failed to update tournament");
    }
  };

  const handleStatusClick = (tournament) => {
    setStatusTournamentId(tournament._id);
    setNewStatus(tournament.status);
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async () => {
    try {
      await editTournament({
        id: statusTournamentId,
        data: { status: newStatus },
      }).unwrap();
      setShowStatusModal(false);
      setStatusTournamentId(null);
      setNewStatus("");
      toast.success("Tournament status updated successfully");
    } catch (error) {
      toast.error("Failed to update tournament status");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTournament(deleteId).unwrap();
      toast.success("Tournament deleted");
    } catch (error) {
      toast.error("Failed to delete tournament");
    }
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const getStatusDisplay = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  };

  const getStatusColors = (status) => {
    switch (status) {
      case "upcoming":
        return {
          bg: "bg-blue-500/20",
          text: "text-blue-400",
          border: "border-blue-500/30",
          dot: "bg-blue-400",
        };
      case "registration_open":
        return {
          bg: "bg-green-500/20",
          text: "text-green-400",
          border: "border-green-500/30",
          dot: "bg-green-400",
        };
      case "registration_closed":
        return {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          border: "border-yellow-500/30",
          dot: "bg-yellow-400",
        };
      case "live":
        return {
          bg: "bg-red-500/20",
          text: "text-red-400",
          border: "border-red-500/30",
          dot: "bg-red-400",
        };
      case "completed":
        return {
          bg: "bg-purple-500/20",
          text: "text-purple-400",
          border: "border-purple-500/30",
          dot: "bg-purple-400",
        };
      case "cancelled":
        return {
          bg: "bg-gray-500/20",
          text: "text-gray-400",
          border: "border-gray-500/30",
          dot: "bg-gray-400",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          text: "text-gray-400",
          border: "border-gray-500/30",
          dot: "bg-gray-400",
        };
    }
  };

  const filteredTournaments = (tournaments?.tournaments || []).filter(
    (tournament) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        tournament.name.toLowerCase().includes(term) ||
        tournament.tournamentType.toLowerCase().includes(term) ||
        tournament.mapName.toLowerCase().includes(term);

      const matchesFilter =
        filterStatus === "all" || tournament.status === filterStatus;

      return matchesSearch && matchesFilter;
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-2xl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/20 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Tournament Management
              </h1>
              <p className="text-gray-300 mt-2">
                Create, manage and monitor esports tournaments
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Plus className="h-5 w-5 relative z-10" />
              <span className="relative z-10 font-semibold">
                Create Tournament
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        {isTournamentsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="text-white mt-4 text-center">
                Loading tournaments...
              </div>
            </div>
          </div>
        ) : tournamentsError ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-red-400 text-lg font-semibold">
              Error fetching tournaments: {tournamentsError.message}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
            {/* Enhanced Search and Filter Bar */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search tournaments by name, type, or map..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-gray-800/80 hover:bg-gray-700/80 text-white pl-12 pr-8 py-3 rounded-xl appearance-none transition-all duration-200 cursor-pointer border border-gray-600/50 hover:border-gray-500/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="all">All</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="registration_open">Registration Open</option>
                    <option value="registration_closed">
                      Registration Closed
                    </option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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

            {/* Enhanced Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                  <tr>
                    <th className="text-left p-6 text-gray-300 font-semibold tracking-wide">
                      Tournament
                    </th>
                    <th className="text-left p-6 text-gray-300 font-semibold tracking-wide">
                      Players
                    </th>
                    <th className="text-left p-6 text-gray-300 font-semibold tracking-wide">
                      Prize Pool
                    </th>
                    <th className="text-left p-6 text-gray-300 font-semibold tracking-wide">
                      Status
                    </th>
                    <th className="text-left p-6 text-gray-300 font-semibold tracking-wide">
                      Date
                    </th>
                    <th className="text-left p-6 text-gray-300 font-semibold tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredTournaments.map((tournament, index) => {
                    const status = tournament.status;
                    const displayStatus = getStatusDisplay(status);
                    const { bg, text, border, dot } = getStatusColors(status);
                    return (
                      <tr
                        key={tournament._id}
                        className="group hover:bg-gradient-to-r hover:from-orange-500/5 hover:to-red-500/5 transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white text-lg group-hover:text-orange-300 transition-colors">
                                {tournament.name}
                              </div>
                              <div className="text-gray-400 text-sm capitalize">
                                {tournament.tournamentType} •{" "}
                                {tournament.mapName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Users className="h-4 w-4 text-orange-400" />
                            <span className="font-medium">
                              {tournament.maxSlots}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="font-bold text-green-400">
                              ${tournament.totalPrizePool}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text} ${border}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${dot}`}
                            ></div>
                            {displayStatus}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            <span>
                              {new Date(
                                tournament.startDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 hover:bg-blue-500/20 rounded-lg text-gray-400 hover:text-blue-400 transition-all duration-200 tooltip cursor-pointer"
                              onClick={() => handleViewDetails(tournament._id)}
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 hover:bg-orange-500/20 rounded-lg text-gray-400 hover:text-orange-400 transition-all duration-200 cursor-pointer"
                              onClick={() => handleEditClick(tournament)}
                              title="Edit Tournament"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-400 hover:text-purple-400 transition-all duration-200 cursor-pointer"
                              onClick={() => handleStatusClick(tournament)}
                              title="Update Status"
                            >
                              <Settings className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-all duration-200 cursor-pointer"
                              onClick={() => handleDeleteClick(tournament._id)}
                              disabled={isDeleting}
                              title="Delete Tournament"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <TournamentFormModal
            title="Create Tournament"
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            formData={formData}
            prizeEntries={prizeEntries}
            onInputChange={handleInputChange}
            onPrizeEntryChange={handlePrizeEntryChange}
            onAddPrizeEntry={addPrizeEntry}
            onRemovePrizeEntry={removePrizeEntry}
            onSubmit={handleCreateSubmit}
            isLoading={isCreating}
            buttonText="Create Tournament"
          />
        )}

        {showEditModal && (
          <TournamentFormModal
            title="Edit Tournament"
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            formData={formData}
            prizeEntries={prizeEntries}
            onInputChange={handleInputChange}
            onPrizeEntryChange={handlePrizeEntryChange}
            onAddPrizeEntry={addPrizeEntry}
            onRemovePrizeEntry={removePrizeEntry}
            onSubmit={handleEditSubmit}
            isLoading={isEditing}
            buttonText="Update Tournament"
          />
        )}

        {showDetailsModal && selectedTournament && (
          <TournamentDetailsModal
            tournamentId={selectedTournament}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedTournament(null);
            }}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-white mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this tournament? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteId(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-white mb-4">
                Update Tournament Status
              </h3>
              <div className="relative mb-6">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="bg-gray-800/80 hover:bg-gray-700/80 text-white pl-4 pr-8 py-3 rounded-xl appearance-none transition-all duration-200 cursor-pointer border border-gray-600/50 hover:border-gray-500/50 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 w-full"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="registration_open">Registration Open</option>
                  <option value="registration_closed">
                    Registration Closed
                  </option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusTournamentId(null);
                    setNewStatus("");
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusSubmit}
                  disabled={isEditing}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentsContent;
