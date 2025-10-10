import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Send,
  MessageCircle,
  Trophy,
  Users,
  Shield,
  Zap,
  Target,
  Star,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      info: "bussinessgamerpulse077@gmail.com",
      description: "Get response within 1-2 hours",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Phone,
      title: "Live Chat",
      info: "whatsapp no - 7894259892",
      description: "Instant gaming support (10am-6pm) ",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: MessageCircle,
      title: "Discord",
      info: "coming soon",
      // description: "Join our community",
      color: "from-purple-500 to-orange-500",
    },
    {
      icon: Target,
      title: "Emergency",
      info: "whatsapp no - 7894259892",
      description: "Tournament issues only",
      color: "from-red-500 to-orange-500",
    },
  ];

  const features = [
    { icon: Shield, label: "Secure Platform", value: "99.9%" },
    { icon: Zap, label: "Response Time", value: "<30s" },
    { icon: Trophy, label: "Tournaments", value: "1.2K+" },
    { icon: Users, label: "Players", value: "150K+" },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pt-[2rem] lg:pt-[5rem]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-500 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-orange-600 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 animate-pulse">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>24/7 Gaming Support</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
              LEVEL UP YOUR
              <br />
              <span className="text-white">CONTACT GAME</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ready to dominate Free Fire tournaments? Our elite support squad
              is standing by to help you
              <span className="text-orange-400 font-semibold">
                {" "}
                achieve victory
              </span>
            </p>

            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-900/50 backdrop-blur-sm border border-orange-500/20 rounded-xl p-3 sm:p-4 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      {feature.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {feature.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Gaming Style Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Contact Methods - Left Side */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 border border-orange-500/30 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-orange-400 mb-4 sm:mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                Choose Your Weapon
              </h2>

              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        activeCard === index ? "ring-2 ring-orange-500" : ""
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${
                          method.color.includes("orange")
                            ? "#EA580C"
                            : "#DC2626"
                        } 0%, ${
                          method.color.includes("yellow")
                            ? "#EAB308"
                            : "#EA580C"
                        } 100%)`,
                      }}
                      onMouseEnter={() => setActiveCard(index)}
                      onMouseLeave={() => setActiveCard(null)}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="bg-black/20 p-2 sm:p-3 rounded-lg backdrop-blur-sm">
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-sm sm:text-base">
                            {method.title}
                          </h3>
                          <p className="text-white/90 font-medium text-xs sm:text-sm">
                            {method.info}
                          </p>
                          <p className="text-white/70 text-xs">
                            {method.description}
                          </p>
                        </div>
                      </div>

                      {activeCard === index && (
                        <div className="absolute inset-0 ounded-xl animate-pulse"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form - Center/Right */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-4 sm:p-6 md:p-8 border border-orange-500/30 backdrop-blur-sm relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-500/20 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                      Deploy Your Message
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Select your mission parameters and engage!
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 fill-current"
                      />
                    ))}
                  </div>
                </div>

                {isSubmitted && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-600 to-green-500 rounded-xl border border-green-400/50">
                    <p className="text-white font-bold flex items-center gap-2 text-sm sm:text-base">
                      <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                      Mission Successful! Message deployed to command center.
                    </p>
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-bold text-orange-400 uppercase tracking-wider">
                        Player Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-black/50 border-2 border-gray-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-white placeholder-gray-500 font-medium transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your gaming alias"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-bold text-orange-400 uppercase tracking-wider">
                        Email Coordinates
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-black/50 border-2 border-gray-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-white placeholder-gray-500 font-medium transition-all duration-200 text-sm sm:text-base"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-orange-400 uppercase tracking-wider">
                      Mission Type
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-black/50 border-2 border-gray-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-white font-medium transition-all duration-200 text-sm sm:text-base"
                    >
                      <option value="">🎯 Select Mission Type</option>
                      <option value="tournament-hosting">
                        🏆 Tournament Join
                      </option>
                      <option value="technical-support">
                        ⚡ Technical Support
                      </option>
                      <option value="bug-report">🐛 Bug Report</option>
                      <option value="withdraw">💳 Withdraw Inquiry</option>
                      <option value="deposit">💲Deposit Inquiry</option>
                      <option value="general">💬 General Question</option>
                      <option value="feedback">
                        ⭐ Feedback & Suggestions
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-orange-400 uppercase tracking-wider">
                      Mission Briefing
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-black/50 border-2 border-gray-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-white placeholder-gray-500 font-medium transition-all duration-200 text-sm sm:text-base resize-none"
                      placeholder="Brief us on your mission objectives, challenges, or how we can support your gaming journey..."
                    ></textarea>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 hover:from-orange-500 hover:via-red-500 hover:to-orange-400 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg uppercase tracking-wider cursor-pointer"
                  >
                    <Send className="h-5 w-5 sm:h-6 sm:w-6" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-4 left-8 w-4 h-4 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-8 right-16 w-3 h-3 bg-white rounded-full animate-ping delay-300"></div>
            <div className="absolute bottom-12 left-1/4 w-2 h-2 bg-white rounded-full animate-ping delay-700"></div>
            <div className="absolute bottom-6 right-8 w-5 h-5 bg-white rounded-full animate-ping delay-1000"></div>
          </div>

          <div className="relative z-10 text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-black mb-4 uppercase">
              Ready to Dominate?
            </h3>
            <p className="text-black/80 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto font-medium">
              Join the elite ranks of tournament organizers. Your journey to
              legendary status starts with one click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black hover:bg-gray-900 text-orange-500 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 uppercase tracking-wider cursor-pointer">
                🚀 Start Tournament
              </button>
              <button className="border-2 border-black text-black hover:bg-black hover:text-orange-500 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 uppercase tracking-wider cursor-pointer">
                📊 View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
