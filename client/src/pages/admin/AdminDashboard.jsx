import { useState } from "react";
import {
  LayoutDashboard,
  Trophy,
  Users,
  DollarSign,
  Settings,
  Bell,
  Gamepad2,
  TrendingUp,
  Menu,
  LogOut,
  Crown,
  Shield,
} from "lucide-react";
import { useGetTournamentsQuery } from "../../features/api/tournamentApi";
import DashboardContent from "../../components/admin/DashboardContent";
import TournamentsContent from "../../components/admin/TournamentsContent";
import PlayersContent from "../../components/admin/PlayersContent";
import MatchesContent from "../../components/admin/MatchesContent";
import PaymentsContent from "../../components/admin/PaymentsContent";
import ReportsContent from "../../components/admin/ReportsContent";
import SettingsContent from "../../components/admin/SettingsContent";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: tournaments } = useGetTournamentsQuery();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tournaments", label: "Tournaments", icon: Trophy },
    { id: "players", label: "Players", icon: Users },
    { id: "matches", label: "Matches", icon: Gamepad2 },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "reports", label: "Reports", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const matches = [
    {
      id: 1,
      tournament: "Winter Championship",
      teams: "Team Alpha vs Team Beta",
      status: "Live",
      time: "14:30",
    },
    {
      id: 2,
      tournament: "Squad Showdown",
      teams: "Fire Squad vs Lightning",
      status: "Scheduled",
      time: "16:00",
    },
    {
      id: 3,
      tournament: "Winter Championship",
      teams: "Phoenix vs Dragons",
      status: "Completed",
      time: "12:00",
    },
  ];

  const stats = [
    {
      label: "Total Tournaments",
      value: tournaments ? String(tournaments.count) : "0",
      change: "+12%",
      icon: Trophy,
      color: "text-orange-400",
    },
    {
      label: "Active Players",
      value: "2,847",
      change: "+8%",
      icon: Users,
      color: "text-green-400",
    },
    {
      label: "Total Prize Pool",
      value: tournaments
        ? `$${tournaments.tournaments.reduce(
            (sum, t) => sum + (t.totalPrizePool || 0),
            0
          )}`
        : "$0",
      change: "+24%",
      icon: DollarSign,
      color: "text-blue-400",
    },
    {
      label: "Live Matches",
      value: "18",
      change: "+3",
      icon: Gamepad2,
      color: "text-purple-400",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent stats={stats} matches={matches} />;
      case "tournaments":
        return <TournamentsContent />;
      case "players":
        return <PlayersContent />;
      case "matches":
        return <MatchesContent />;
      case "payments":
        return <PaymentsContent />;
      case "reports":
        return <ReportsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent stats={stats} matches={matches} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex flex-col w-64 bg-gray-900/95 backdrop-blur border-r border-gray-800 h-full">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Crown className="h-8 w-8 text-orange-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FF Tournaments</h1>
                <p className="text-sm text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      activeTab === item.id
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Admin User</p>
                <p className="text-gray-400 text-xs">admin@fftournaments.com</p>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:ml-64">
        <header className="bg-[#101726] border-b border-gray-800 p-4 fixed top-0 w-full z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-800 text-gray-400 cursor-pointer hover:text-white transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-white capitalize">
                  {activeTab}
                </h2>
                <p className="text-gray-400 text-sm">
                  Manage your tournaments and players
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-400 font-medium text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 pt-[6rem]">{renderContent()}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;
