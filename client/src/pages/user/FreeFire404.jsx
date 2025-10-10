import { useState, useEffect } from "react";
import {
  Home,
  Search,
  Trophy,
  Users,
  Calendar,
  ArrowLeft,
  Gamepad2,
  Flame,
} from "lucide-react";

const FreeFire404 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const quickLinks = [
    { icon: Home, text: "Home", action: handleGoHome },
    {
      icon: Trophy,
      text: "Tournaments",
      action: () => (window.location.href = "/tournaments"),
    },
    {
      icon: Users,
      text: "Teams",
      action: () => (window.location.href = "/teams"),
    },
    {
      icon: Calendar,
      text: "Events",
      action: () => (window.location.href = "/events"),
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(249, 115, 22, 0.3) 0%, rgba(234, 88, 12, 0.2) 25%, transparent 50%)`,
          }}
        />

        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "40px 40px sm:50px sm:50px",
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="relative">
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-500 animate-bounce" />
                <div className="absolute inset-0 blur-xl bg-orange-500 opacity-50 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                FreeFire
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Tournament Hosting Platform
            </p>
          </div>

          <div className="mb-8 sm:mb-10 md:mb-12">
            <div
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 leading-none mb-3 sm:mb-4 select-none"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                textShadow: isHovering
                  ? "0 0 30px sm:0 sm:0 sm:50px rgba(249, 115, 22, 0.5)"
                  : "none",
                transition: "text-shadow 0.3s ease",
              }}
            >
              404
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                Match Not Found!
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
                Looks like this tournament got eliminated! The page you're
                looking for has been disqualified from our servers.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">
                Don't worry, champion - let's get you back in the game.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
            <button
              onClick={handleGoHome}
              className="group flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg shadow-md sm:shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" />
              <span>Back to Arena</span>
            </button>
          </div>

          {/* Gaming Elements */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-8 opacity-60">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-pulse" />
              <span className="text-gray-500 text-xs sm:text-sm">
                Ready Player One
              </span>
            </div>
            <div className="w-px h-4 sm:h-6 bg-gray-700" />
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Trophy
                className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <span className="text-gray-500 text-xs sm:text-sm">
                Victory Awaits
              </span>
            </div>
          </div>

          <div
            className="absolute top-1/4 left-4 sm:left-6 md:left-10 hidden md:block animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            </div>
          </div>

          <div
            className="absolute top-1/3 right-4 sm:right-6 md:right-10 hidden md:block animate-bounce"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 sm:w-80 md:w-96 h-24 sm:h-28 md:h-32 bg-gradient-to-t from-orange-500/20 to-transparent blur-3xl" />

      {/* Corner Decorations */}
      <div className="absolute top-6 sm:top-8 md:top-10 left-6 sm:left-8 md:left-10 w-16 sm:w-20 h-16 sm:h-20 border-l-2 border-t-2 border-orange-500/30" />
      <div className="absolute top-6 sm:top-8 md:top-10 right-6 sm:right-8 md:right-10 w-16 sm:w-20 h-16 sm:h-20 border-r-2 border-t-2 border-orange-500/30" />
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-6 sm:left-8 md:left-10 w-16 sm:w-20 h-16 sm:h-20 border-l-2 border-b-2 border-orange-500/30" />
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 right-6 sm:right-8 md:right-10 w-16 sm:w-20 h-16 sm:h-20 border-r-2 border-b-2 border-orange-500/30" />
    </div>
  );
};

export default FreeFire404;
