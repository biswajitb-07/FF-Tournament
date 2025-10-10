import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  Zap,
  Shield,
  Trophy,
  Users,
} from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Getting Started");

  const faqData = [
    {
      id: 1,
      category: "Getting Started",
      icon: HelpCircle,
      question: "How do I create an account?",
      answer:
        "Creating an account is simple! Click on the 'Register' button, fill in your basic information including email and password, verify your email address, and you're ready to start participating in tournaments.",
    },
    {
      id: 2,
      category: "Wallet & Payments",
      icon: Shield,
      question: "How do I add money to my wallet?",
      answer:
        "You can add money to your wallet through multiple payment methods including UPI, credit/debit cards, net banking, and digital wallets. Go to 'My Wallet' section, click 'Add Money', choose your preferred payment method, and complete the transaction securely.",
    },
    {
      id: 3,
      category: "Tournament",
      icon: Trophy,
      question: "What types of tournaments are available?",
      answer:
        "We offer various tournament formats including daily contests, weekly championships, season-long leagues, and special events. Tournaments are available for different skill levels - from beginner-friendly to professional competitions with varying entry fees and prize pools.",
    },
    {
      id: 4,
      category: "Tournament",
      icon: Trophy,
      question: "How do I join a tournament?",
      answer:
        "After registering and funding your wallet, browse available tournaments in the 'Tournaments' section. Select your preferred tournament, pay the entry fee, and you'll receive room ID and password in 'My Tournaments' section before the tournament starts.",
    },
    {
      id: 5,
      category: "Gameplay",
      icon: Users,
      question: "Where do I find my room ID and password?",
      answer:
        "Once you've joined a tournament, visit the 'My Tournaments' section in your dashboard. Here you'll find all your active tournaments with their respective room IDs and passwords. These credentials will be available 15-30 minutes before the tournament starts.",
    },
    {
      id: 6,
      category: "Wallet & Payments",
      icon: Shield,
      question: "Is my money safe? How do withdrawals work?",
      answer:
        "Yes, your money is completely safe. We use bank-level encryption and secure payment gateways. Withdrawals are processed within 24-48 hours to your registered bank account or UPI. You can withdraw your winnings anytime through the 'Withdraw' option in your wallet.",
    },
    {
      id: 7,
      category: "Tournament",
      icon: Trophy,
      question: "What happens if I miss the tournament start time?",
      answer:
        "Tournament start times are strict. If you miss the start time, you won't be able to join that specific tournament. However, your entry fee will remain in your wallet and can be used for future tournaments. We recommend joining the tournament room 5-10 minutes early.",
    },
    {
      id: 8,
      category: "Getting Started",
      icon: HelpCircle,
      question: "Do I need to download any app or software?",
      answer:
        "Our platform works seamlessly on web browsers, so no downloads are required for registration and tournament management. However, depending on the game type, you might need the specific game installed (like PUBG Mobile, Free Fire, etc.) on your device to participate.",
    },
    {
      id: 9,
      category: "Gameplay",
      icon: Users,
      question: "Can I play with friends in the same tournament?",
      answer:
        "Yes! You and your friends can join the same tournament independently. Once you both join, you'll get the same room ID and password, allowing you to play together. Some tournaments also support team registrations where you can register as a squad.",
    },
    {
      id: 10,
      category: "Wallet & Payments",
      icon: Shield,
      question: "Are there any fees for deposits or withdrawals?",
      answer:
        "Deposits are usually free, but some payment methods may have minimal charges by the payment gateway. Withdrawal fees vary based on the method chosen - UPI withdrawals are typically free, while bank transfers may have a small processing fee.",
    },
  ];

  const categories = ["All", ...new Set(faqData.map((faq) => faq.category))];

  const filteredFAQs = faqData
    .filter((faq) =>
      selectedCategory === "All" || faq.category === selectedCategory
        ? true
        : false
    )
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCategoryColor = (category) => {
    const colors = {
      All: "from-gray-500 to-gray-600",
      "Getting Started": "from-blue-500 to-blue-600",
      "Wallet & Payments": "from-green-500 to-green-600",
      Tournament: "from-orange-500 to-orange-600",
      Gameplay: "from-purple-500 to-purple-600",
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  return (
    <>
      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pt-12 sm:pt-16 lg:pt-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mr-2 animate-pulse" />
            <span className="text-orange-400 font-semibold text-sm sm:text-base uppercase tracking-wider">
              Support Center
            </span>
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 ml-2 animate-pulse" />
          </div>

          <h1 className="text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            Frequently Asked
          </h1>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6 sm:mb-8">
            Questions
          </h2>

          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12">
            Find answers to common questions about tournaments, payments,
            gameplay, and more.
            <span className="text-orange-400 font-semibold">
              {" "}
              Can't find what you're looking for?
            </span>{" "}
            Contact our support team!
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur opacity-30"></div>
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-1">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 rounded-full focus:outline-none text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          {categories.map((category) => (
            <div key={category} className="relative group">
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${getCategoryColor(
                  category
                )} rounded-full blur opacity-0 group-hover:opacity-50 transition duration-300 ${
                  selectedCategory === category ? "opacity-50" : ""
                }`}
              ></div>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`relative bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category ? "bg-white/20 scale-105" : ""
                }`}
              >
                {category}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="grid lg:grid-cols-2 lg:gap-3 gap-y-3 place-items-center">
          {filteredFAQs.map((faq, index) => (
            <div key={faq.id} className="relative group">
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${getCategoryColor(
                  faq.category
                )} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}
              ></div>
              <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    <div
                      className={`flex-shrink-0 p-2 sm:p-3 bg-gradient-to-br ${getCategoryColor(
                        faq.category
                      )} rounded-xl shadow-lg`}
                    >
                      <faq.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(
                            faq.category
                          )} text-white`}
                        >
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white group-hover:text-orange-200 transition-colors duration-200 pr-4">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* Toggle Icon */}
                  <div className="flex-shrink-0 ml-2">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 transform transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-orange-400 transform transition-all duration-200" />
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="pl-12 sm:pl-16">
                      <div className="h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent mb-4"></div>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search terms or browse all categories
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FAQ;
