import React, { useState, useEffect } from "react";
import { Play, Zap, Trophy, Gamepad2 } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

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
    { icon: Gamepad2, delay: "0s", position: "top-20 left-20" },
    { icon: Trophy, delay: "0.5s", position: "top-40 right-20" },
    { icon: Zap, delay: "1s", position: "bottom-35 left-10" },
    { icon: Play, delay: "1.5s", position: "bottom-20 right-25" },
  ];

  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-red-500 rounded-full blur-2xl animate-bounce"
          style={{
            transform: `translate(-${mousePosition.x}px, -${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-28 h-28 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-20 h-20 bg-purple-600 rounded-full blur-2xl animate-bounce delay-500"
          style={{
            transform: `translate(-${mousePosition.x}px, -${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className={`absolute ${item.position} text-orange-500 animate-bounce`}
          style={{
            animationDelay: item.delay,
            animationDuration: "3s",
          }}
        >
          <item.icon size={32} />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center justify-center pt-[2rem] lg:pt-[5rem]">
        <div
          className={`text-white text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-sm font-semibold mb-8 animate-pulse">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">
              Epic Battles Await
            </span>
          </div>

          {/* Main heading */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-widest">
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                Game On
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                Thrilling
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">Challenges</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Immerse yourself in epic Free Fire tournaments. Battle with players
              worldwide and claim your spot in gaming history.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 rounded-xl font-bold text-lg text-white transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/50 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2 uppercase tracking-wider">
                <Play className="w-5 h-5" />
                Start Playing
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-6 sm:gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-400">48K+</div>
              <div className="text-xs sm:text-sm text-gray-400">Players</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-400">1000+</div>
              <div className="text-xs sm:text-sm text-gray-400">Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-xs sm:text-sm text-gray-400">Online</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </div>
  );
};

export default Hero;