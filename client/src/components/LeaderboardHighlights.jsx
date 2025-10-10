import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Calendar,
} from "lucide-react";

const topPlayers = [
  {
    rank: 1,
    name: "ShadowHunter",
    avatar: "🥷",
    points: 15847,
    tournaments: 47,
    winRate: 94,
    kills: 2856,
    country: "🇺🇸",
    trend: "up",
    badge: "Legendary",
  },
  {
    rank: 2,
    name: "FireStorm",
    avatar: "🔥",
    points: 14932,
    tournaments: 42,
    winRate: 91,
    kills: 2634,
    country: "🇧🇷",
    trend: "up",
    badge: "Elite",
  },
  {
    rank: 3,
    name: "NightRider",
    avatar: "🏍️",
    points: 14456,
    tournaments: 38,
    winRate: 89,
    kills: 2498,
    country: "🇮🇳",
    trend: "down",
    badge: "Pro",
  },
  {
    rank: 4,
    name: "DragonSlayer",
    avatar: "🐉",
    points: 13875,
    tournaments: 35,
    winRate: 87,
    kills: 2301,
    country: "🇩🇪",
    trend: "up",
    badge: "Expert",
  },
  {
    rank: 5,
    name: "VoidWalker",
    avatar: "👤",
    points: 13456,
    tournaments: 33,
    winRate: 85,
    kills: 2156,
    country: "🇯🇵",
    trend: "same",
    badge: "Veteran",
  },
];

const topTournaments = [
  {
    rank: 1,
    name: "World Championship Finals",
    participants: 10000,
    prizePool: "$500,000",
    status: "Live",
    date: "Nov 25, 2024",
    region: "Global",
    viewers: 2500000,
    icon: "🏆",
  },
  {
    rank: 2,
    name: "Asia Pacific Masters",
    participants: 8500,
    prizePool: "$300,000",
    status: "Completed",
    date: "Nov 20, 2024",
    region: "APAC",
    viewers: 1800000,
    icon: "🌏",
  },
  {
    rank: 3,
    name: "European Elite Cup",
    participants: 7200,
    prizePool: "$200,000",
    status: "Upcoming",
    date: "Dec 1, 2024",
    region: "Europe",
    viewers: 0,
    icon: "⚔️",
  },
  {
    rank: 4,
    name: "Americas Showdown",
    participants: 6800,
    prizePool: "$150,000",
    status: "Registration",
    date: "Dec 5, 2024",
    region: "Americas",
    viewers: 0,
    icon: "🎯",
  },
  {
    rank: 5,
    name: "Rising Stars Tournament",
    participants: 5500,
    prizePool: "$100,000",
    status: "Upcoming",
    date: "Dec 10, 2024",
    region: "Global",
    viewers: 0,
    icon: "⭐",
  },
];

export default function LeaderboardHighlights() {
  const [activeTab, setActiveTab] = useState("players");
  const [animationKey, setAnimationKey] = useState(0);
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    setAnimationKey((k) => k + 1);
  }, [activeTab]);

  const handleMouseDown = (e) => {
    const slider = scrollRef.current;
    if (!slider) return;
    e.stopPropagation();
    setIsDown(true);
    slider.classList.add("cursor-grabbing");
    const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    setStartX(x - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const slider = scrollRef.current;
    const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    const walk = (x - slider.offsetLeft - startX) * 1.2;
    slider.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDown(false);
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />;
      default:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />;
    }
  };

  const getRankBgColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
      case 2:
        return "from-gray-400/20 to-gray-500/10 border-gray-400/30";
      case 3:
        return "from-orange-500/20 to-orange-600/10 border-orange-500/30";
      default:
        return "from-gray-600/20 to-gray-700/10 border-gray-600/20";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />;
      case "down":
        return (
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 rotate-180" />
        );
      default:
        return (
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500 rounded-full"></div>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Live":
        return "bg-red-500 text-white animate-pulse";
      case "Completed":
        return "bg-green-500 text-white";
      case "Upcoming":
        return "bg-blue-500 text-white";
      case "Registration":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="bg-[#151627] text-white relative overflow-hidden pb-16">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-7">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 animate-pulse">
            <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Live Rankings</span>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Witness the{" "}
            <span className="text-orange-400 font-bold">elite warriors</span>{" "}
            dominating the Free Fire battlegrounds
          </p>
        </div>

        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-1 sm:p-2 border border-orange-500/20">
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setActiveTab("players")}
                className={`px-4 py-3 sm:px-8 sm:py-4 rounded-lg font-bold transition-all duration-300 flex items-center gap-1 sm:gap-2 ${
                  activeTab === "players"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Top Players
              </button>
              <button
                onClick={() => setActiveTab("tournaments")}
                className={`px-4 py-3 sm:px-8 sm:py-4 rounded-lg font-bold transition-all duration-300 flex items-center gap-1 sm:gap-2 ${
                  activeTab === "tournaments"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                Elite Tournaments
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUpOrLeave}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 cursor-grab scroll-container"
        >
          {activeTab === "players" &&
            topPlayers.map((player) => (
              <div
                key={player.name}
                className={`bg-gradient-to-br ${getRankBgColor(
                  player.rank
                )} backdrop-blur-sm border rounded-xl p-4 flex-shrink-0 w-80 snap-start hover:shadow-lg hover:shadow-orange-500/10 transition-transform transform hover:scale-[1.02]`}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center min-w-[48px]">
                        <div className="text-lg font-black text-white">
                          #{player.rank}
                        </div>
                        {getRankIcon(player.rank)}
                      </div>
                      <div className="text-2xl bg-gray-800 p-2 rounded-full">
                        {player.avatar}
                      </div>
                      <div className="text-container">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-white">
                            {player.name}
                          </h3>
                          <span>{player.country}</span>
                          {getTrendIcon(player.trend)}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold mt-1 inline-block ${
                            player.badge === "Legendary"
                              ? "bg-yellow-500 text-black"
                              : player.badge === "Elite"
                              ? "bg-purple-500 text-white"
                              : player.badge === "Pro"
                              ? "bg-blue-500 text-white"
                              : player.badge === "Expert"
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {player.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-orange-500">
                        {player.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Points</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-500">
                        {player.tournaments}
                      </div>
                      <div className="text-xs text-gray-400">Tournaments</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-500">
                        {player.winRate}%
                      </div>
                      <div className="text-xs text-gray-400">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-500">
                        {player.kills.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Total Kills</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {activeTab === "tournaments" &&
            topTournaments.map((t) => (
              <div
                key={t.name}
                className={`bg-gradient-to-br ${getRankBgColor(
                  t.rank
                )} backdrop-blur-sm border rounded-xl p-4 flex-shrink-0 w-80 snap-start hover:shadow-lg hover:shadow-orange-500/10 transition-transform transform hover:scale-[1.02]`}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center min-w-[48px]">
                        <div className="text-lg font-black text-white">
                          #{t.rank}
                        </div>
                        {getRankIcon(t.rank)}
                      </div>
                      <div className="text-2xl bg-gray-800 p-2 rounded-full">
                        {t.icon}
                      </div>
                      <div className="text-container">
                        <h3 className="text-lg font-bold text-white">
                          {t.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{t.date}</span>
                          <span>{t.region}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-orange-500">
                        {t.participants.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Players</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-500">
                        {t.prizePool}
                      </div>
                      <div className="text-xs text-gray-400">Prize Pool</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-500">
                        {t.viewers > 0
                          ? `${(t.viewers / 1000000).toFixed(1)}M`
                          : "---"}
                      </div>
                      <div className="text-xs text-gray-400">Viewers</div>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
