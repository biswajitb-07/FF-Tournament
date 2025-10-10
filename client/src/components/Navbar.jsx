import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  Gamepad2,
  User,
  LogIn,
  UserPlus,
  Trophy,
  Zap,
  Home,
  CircleUserRound,
  Wallet,
} from "lucide-react";

import assets from "../assets/assets";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 10);

          const direction = currentScrollY > lastScrollY ? "down" : "up";
          setScrollDirection(direction);

          if (currentScrollY <= 50) {
            setIsVisible(true);
          } else if (direction === "down" && currentScrollY > lastScrollY + 5) {
            setIsVisible(false);
            setIsMobileMenuOpen(false);
          } else if (direction === "up" && currentScrollY < lastScrollY - 5) {
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const baseNavItems = [
    { path: "/", label: "HOME", icon: Home },
    { path: "/tournament", label: "TOURNAMENT", icon: Trophy },
    { path: "/about-us", label: "ABOUT US", icon: User },
    { path: "/contact", label: "CONTACT", icon: Zap },
    {
      path: "/profile",
      label: "PROFILE",
      icon: CircleUserRound,
      hideOnDesktop: true,
    },
  ];

  const navItems = user
    ? [...baseNavItems, { path: "/wallet", label: "WALLET", icon: Wallet }]
    : baseNavItems;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-[#0D0E1B]/95 backdrop-blur-xl border-b border-orange-500/20 shadow-2xl shadow-orange-500/10"
            : "bg-gradient-to-r from-[#0D0E1B] via-[#1a1b2e] to-[#0D0E1B]"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF7A21] to-transparent animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A21] to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-all duration-300 scale-110" />
                <div
                  onClick={() => navigate("/")}
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-500/25"
                >
                  {assets?.logo ? (
                    <img
                      src={assets.logo}
                      alt="logo"
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <Gamepad2 className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>

              <div className="ml-3 hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-[#FF7A21] to-orange-400 bg-clip-text text-transparent">
                  Gamer Pulse
                </span>
                <div className="text-xs text-gray-400 -mt-1">Pro Gaming</div>
              </div>
            </div>

            {/* Desktop Navigation - PROFILE hidden */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2">
                {navItems
                  .filter((item) => !item.hideOnDesktop)
                  .map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `relative group px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                          isActive
                            ? "text-white bg-gradient-to-r from-[#FF7A21]/20 to-orange-600/20 border border-[#FF7A21]/30 shadow-lg shadow-orange-500/20"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center space-x-2 relative z-10">
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {isActive && (
                            <>
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF7A21] to-orange-500 rounded-full" />
                              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A21]/5 to-orange-500/5 rounded-xl" />
                            </>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A21]/0 to-orange-500/0 group-hover:from-[#FF7A21]/10 group-hover:to-orange-500/10 rounded-xl transition-all duration-300" />
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 skew-x-12" />
                        </>
                      )}
                    </NavLink>
                  ))}
              </div>
            </div>

            {/* Auth Buttons */}
            {!user && (
              <div className="hidden lg:flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="group relative px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white border-2 border-gray-600 hover:border-[#FF7A21] rounded-xl transition-all duration-300 hover:bg-[#FF7A21]/10 overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center space-x-2 relative z-10">
                    <LogIn className="w-4 h-4" />
                    <span>LOGIN</span>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-[#FF7A21] to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-[#FF7A21]/90 hover:to-orange-600/90 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A21] to-orange-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="relative flex items-center space-x-2 z-10">
                    <UserPlus className="w-4 h-4" />
                    <span>SIGN UP</span>
                  </div>
                </button>
              </div>
            )}

            {user && (
              <div className="flex items-center space-x-2">
                <div
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:scale-110 active:scale-90 transition-all duration-200 ease-in-out group"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username || "User Profile"}
                      className="w-8 h-8 hover:scale-105 transition-colors duration-200 ease-in-out rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center bg-orange-700 text-white rounded-full text-lg font-semibold">
                      {user?.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}
                </div>

                {user.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="px-3 py-1 text-xs font-semibold text-white bg-green-700 rounded-lg transition-colors duration-200 hover:bg-green-600 cursor-pointer"
                  >
                    Admin
                  </button>
                )}

                {user.role === "room_host" && (
                  <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="px-3 py-1 text-xs font-semibold text-white bg-green-700 rounded-lg transition-colors duration-200 hover:bg-green-600 cursor-pointer"
                  >
                    Host
                  </button>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative p-2 text-gray-300 hover:text-white hover:bg-[#FF7A21]/20 rounded-xl transition-all duration-300 border border-gray-600 hover:border-[#FF7A21] cursor-pointer"
              >
                <div className="relative z-10">
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer - slides in from the right */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-[#0D0E1B]/98 backdrop-blur-xl
                    border-l border-[#FF7A21]/20 z-50 transform transition-transform duration-300 ease-in-out
                    shadow-2xl shadow-black/50 ${
                      isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
      >
        {/* Mobile Menu Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-[#FF7A21]/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF7A21] to-orange-600 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-[#FF7A21] to-orange-400 bg-clip-text text-transparent">
                Gamer Pulse
              </span>
              <div className="text-xs text-gray-400 -mt-1">Pro Gaming</div>
            </div>
          </div>
          <button
            onClick={closeMobileMenu}
            className="p-2 text-gray-300 hover:text-white hover:bg-[#FF7A21]/20 rounded-xl transition-all duration-300 border border-gray-600 hover:border-[#FF7A21]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="px-4 pt-6 pb-6 space-y-2 overflow-y-auto h-full">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer group ${
                  isActive
                    ? "text-white bg-gradient-to-r from-[#FF7A21]/20 to-orange-600/20 border-l-4 border-[#FF7A21] shadow-lg shadow-orange-500/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5 hover:translate-x-2"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-[#FF7A21]/20 text-[#FF7A21]"
                        : "bg-gray-800 group-hover:bg-[#FF7A21]/10 group-hover:text-[#FF7A21]"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-[#FF7A21] rounded-full animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {!user && (
            <div className="pt-6 mt-6 border-t border-[#FF7A21]/20 space-y-4">
              <button
                onClick={() => {
                  closeMobileMenu();
                  navigate("/login");
                }}
                className="w-full flex items-center justify-center space-x-3 px-4 py-4 text-sm font-semibold text-gray-300 hover:text-white border-2 border-gray-600 hover:border-[#FF7A21] rounded-xl transition-all duration-300 hover:bg-[#FF7A21]/10 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-[#FF7A21]/10 transition-all duration-300">
                  <LogIn className="w-4 h-4" />
                </div>
                <span>LOGIN</span>
              </button>

              <button
                onClick={() => {
                  closeMobileMenu();
                  navigate("/login");
                }}
                className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-[#FF7A21] to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-[#FF7A21]/90 hover:to-orange-600/90 transition-all duration-300 shadow-lg shadow-orange-500/25 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span>SIGN UP</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
