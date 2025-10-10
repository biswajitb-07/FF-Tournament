import React, { useState, useEffect } from "react";
import { Gamepad2, Trophy, Zap, Play } from "lucide-react";
import assets from "../assets/assets";

const UpcomingTournament = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingIcons = [
    {
      icon: Gamepad2,
      delay: "0s",
      position: "top-20 left-20",
      color: "text-orange-500",
    },
    {
      icon: Trophy,
      delay: "0.5s",
      position: "top-40 right-20",
      color: "text-red-500",
    },
    {
      icon: Zap,
      delay: "1s",
      position: "bottom-35 left-32",
      color: "text-yellow-500",
    },
    {
      icon: Play,
      delay: "1.5s",
      position: "bottom-20 right-25",
      color: "text-orange-500",
    },
  ];

  const tournaments = [
    {
      id: 1,
      name: "Free Fire Battle Royale",
      date: "October 10, 2025",
      prizePool: "₹5,00,000",
      participants: "1000+",
      image: assets.freefire,
    },
    {
      id: 2,
      name: "Elite Fire Showdown",
      date: "October 15, 2025",
      prizePool: "₹3,00,000",
      participants: "800+",
      image: assets.freefire,
    },
    {
      id: 3,
      name: "Firestorm Championship",
      date: "October 20, 2025",
      prizePool: "₹7,50,000",
      participants: "1200+",
      image: assets.freefire,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 pt-[5rem] lg:pt-[8rem] pb-10">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-gray-900/20 to-yellow-500/20"></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url(${assets.freefire})`,
        }}
      ></div>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"
          style={{
            transform: `translate(-${mousePosition.x}px, -${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className={`absolute ${item.position} ${item.color} opacity-30 animate-bounce`}
          style={{
            animationDelay: item.delay,
            animationDuration: "3s",
          }}
        >
          <item.icon size={32} />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-sm font-semibold animate-pulse mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white">Upcoming Tournaments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
            Join the Battle
          </h1>
          <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
            Get ready for thrilling Free Fire tournaments. Register now and
            compete for epic prizes!
          </p>
        </div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="relative bg-gray-800/50 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-transparent to-red-500/30"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {tournament.name}
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <span className="text-orange-400">Date:</span>{" "}
                  {tournament.date}
                </p>
                <p>
                  <span className="text-red-400">Prize Pool:</span>{" "}
                  {tournament.prizePool}
                </p>
                <p>
                  <span className="text-yellow-400">Participants:</span>{" "}
                  {tournament.participants}
                </p>
              </div>
              <button className="group relative w-full mt-4 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-xl font-semibold text-white uppercase tracking-wider transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/50">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Register Now
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </div>
  );
};

export default UpcomingTournament;
