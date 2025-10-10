import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Wallet,
  Trophy,
  KeyRound,
  Sparkles,
  Zap,
} from "lucide-react";

const HowToJoin = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: "Register",
      description: "Create your account to get started with tournaments",
      icon: UserPlus,
      gradient: "from-orange-400 to-red-500",
    },
    {
      id: 2,
      title: "Add Money in Wallet",
      description: "Fund your wallet to participate in paid tournaments",
      icon: Wallet,
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: 3,
      title: "Select Tournament and Join",
      description: "Browse available tournaments and join the one you prefer",
      icon: Trophy,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: 4,
      title: "Get Room ID and Password",
      description: "Find your room credentials in 'My Tournament' section",
      icon: KeyRound,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse opacity-60"></div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-7">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="flex justify-center items-center mb-4 sm:mb-6">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mr-2 animate-spin" />
              <span className="text-orange-400 font-semibold text-sm sm:text-base uppercase tracking-wider">
                Tournament Guide
              </span>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 ml-2 animate-spin" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-4 sm:mb-6">
              How to Join
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-4 sm:mb-6">
              Tournament
            </h2>

            <div className="max-w-3xl mx-auto">
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed">
                Follow these{" "}
                <span className="text-orange-400 font-semibold">
                  simple steps
                </span>{" "}
                to start participating in
                <span className="text-yellow-400 font-semibold">
                  {" "}
                  exciting tournaments
                </span>{" "}
                and compete with players worldwide
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
              {steps.map((step) => (
                <div key={step.id} className="relative group">
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${step.gradient} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse`}
                  ></div>

                  <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group">
                    <div
                      className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-2xl`}
                    >
                      <span className="relative z-10">{step.id}</span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                    </div>

                    <div className="flex justify-center mb-6">
                      <div className="relative p-4 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm border border-white/30 group-hover:shadow-2xl transition-all duration-500">
                        <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center relative z-10">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-orange-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {step.description}
                      </p>
                    </div>

                    <div className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-3 left-3 w-1 h-1 bg-yellow-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 sm:mt-20 lg:mt-24">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-30 animate-pulse"></div>

              <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
                    <span className="text-yellow-400 font-semibold uppercase tracking-wider text-sm">
                      Ready to compete?
                    </span>
                    <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent mb-4">
                  Join the Action Now!
                </h3>

                <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of players competing in exciting tournaments.
                  <span className="text-orange-400 font-semibold">
                    {" "}
                    Your victory awaits!
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => navigate("/tournament")}
                    className="relative group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-4 px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl min-w-[200px] cursor-pointer"
                  >
                    <span className="relative z-10">Start Playing</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </button>

                  <button
                    onClick={() => navigate("/about-us")}
                    className="relative group bg-white/10 backdrop-blur-sm border border-orange-500/30 hover:bg-orange-500/20 text-white font-bold py-4 px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 min-w-[200px] cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Progress Indicator */}
          <div className="lg:hidden mt-12">
            <div className="flex justify-center">
              <div className="flex items-center space-x-3">
                {steps.map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg animate-pulse"></div>
                    {index < steps.length - 1 && (
                      <div className="w-6 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 opacity-60"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToJoin;
