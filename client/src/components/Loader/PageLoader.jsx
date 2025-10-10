import React, { useState, useEffect } from "react";

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0; // Reset to 0 to loop the animation
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <div className="relative z-10 text-center px-4 sm:px-6">
        {/* Spinning rings */}
        <div className="relative w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 mx-auto mb-6 sm:mb-8">
          <div className="absolute inset-0 border-2 sm:border-3 md:border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div
            className="absolute inset-1 sm:inset-2 border-2 sm:border-3 md:border-4 border-orange-300 border-b-transparent rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
          <div
            className="absolute inset-2 sm:inset-4 border-2 sm:border-3 md:border-4 border-orange-200 border-r-transparent rounded-full animate-spin"
            style={{ animationDuration: "2s" }}
          ></div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500 mb-1 sm:mb-2 animate-pulse">
            Loading, please wait
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0.1s" }}
            >
              .
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0.2s" }}
            >
              .
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0.3s" }}
            >
              .
            </span>
          </h2>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-16 sm:-top-20 -left-16 sm:-left-20 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 bg-orange-500/10 rounded-full animate-ping"></div>
        <div
          className="absolute -bottom-16 sm:-bottom-20 -right-16 sm:-right-20 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-orange-400/10 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Status indicators */}
        <div className="flex justify-center space-x-1 sm:space-x-2 mt-3 sm:mt-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                i <= progress / 20 ? "bg-orange-500 scale-110" : "bg-gray-600"
              }`}
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 sm:w-20 h-16 sm:h-20 border-t-2 sm:border-t-3 md:border-t-4 border-l-2 sm:border-l-3 md:border-l-4 border-orange-500 opacity-50"></div>
      <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 border-t-2 sm:border-t-3 md:border-t-4 border-r-2 sm:border-r-3 md:border-r-4 border-orange-500 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-16 sm:h-20 border-b-2 sm:border-b-3 md:border-b-4 border-l-2 sm:border-l-3 md:border-l-4 border-orange-500 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-16 sm:w-20 h-16 sm:h-20 border-b-2 sm:border-b-3 md:border-b-4 border-r-2 sm:border-r-3 md:border-r-4 border-orange-500 opacity-50"></div>
    </div>
  );
};

export default PageLoader;
