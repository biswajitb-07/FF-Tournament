import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  CreditCard,
  AlertCircle,
  Gamepad2,
  Trophy,
  IndianRupee,
  Smartphone,
} from "lucide-react";

const RefundPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const policyItems = [
    {
      id: "tournament-eligibility",
      title: "Tournament Entry Refund Eligibility",
      icon: <Trophy className="w-6 h-6" />,
      content: [
        "Tournament entry fees can be refunded up to 24 hours before tournament start time",
        "Refund requests must be initiated through your Gamer Pulse account dashboard",
        "Valid Free Fire UID and registered mobile number verification required",
        "Account must be in good standing with no payment disputes or violations",
        "Team captains can request refunds for entire team (all members must agree)",
        "No refunds available once tournament brackets are generated and published",
      ],
    },
    {
      id: "razorpay-timeframe",
      title: "Razorpay Processing Timeframe",
      icon: <Clock className="w-6 h-6" />,
      content: [
        "Refund initiated instantly through Razorpay payment gateway",
        "Credit/Debit Card refunds: 5-7 business days to reflect in bank statement",
        "Net Banking refunds: 3-5 business days depending on your bank",
        "UPI refunds: Instant to 24 hours (depends on bank processing)",
        "Wallet payments (PayTM, PhonePe, etc.): Instant to 3 business days",
        "EMI refunds: 7-10 business days, interest charges may apply as per bank policy",
      ],
    },
    {
      id: "payment-methods",
      title: "Razorpay Supported Refund Methods",
      icon: <CreditCard className="w-6 h-6" />,
      content: [
        "All refunds processed through original Razorpay payment method used",
        "Credit Cards: Visa, Mastercard, RuPay, American Express supported",
        "Debit Cards: All major Indian banks and international cards",
        "UPI: All UPI apps including Google Pay, PhonePe, PayTM, BHIM",
        "Net Banking: 58+ Indian banks supported through Razorpay",
        "Digital Wallets: PayTM, Mobikwik, FreeCharge, Amazon Pay",
        "International cards: Refunds in INR as per RBI guidelines",
      ],
    },
    {
      id: "tournament-rules",
      title: "Tournament-Specific Refund Rules",
      icon: <Gamepad2 className="w-6 h-6" />,
      content: [
        "Registration fee: 100% refund if cancelled 24+ hours before start",
        "Premium tournaments: 90% refund (10% processing fee) if cancelled early",
        "Squad tournaments: Full team refund or individual slot replacement",
        "Solo tournaments: Individual refund with valid reason",
        "Disqualified players forfeit entry fees (no refunds for rule violations)",
        "Technical issues on our end: Full refund + bonus credits for next tournament",
        "Server downtime during live matches: Prorated refunds or tournament credits",
      ],
    },
    {
      id: "razorpay-charges",
      title: "Processing Fees & Charges",
      icon: <IndianRupee className="w-6 h-6" />,
      content: [
        "Razorpay gateway charges: Deducted from refund amount as per RBI norms",
        "Standard processing fee: ₹3-5 per transaction (varies by payment method)",
        "International card refunds: Additional currency conversion charges apply",
        "EMI refunds: Bank interest and processing charges as per your bank policy",
        "Instant refund service: No additional charges for UPI and wallet refunds",
        "Failed payment refunds: No charges, full amount refunded",
        "Multiple refund requests: Each request processed separately with applicable charges",
      ],
    },
    {
      id: "exceptions",
      title: "Exceptions & Special Cases",
      icon: <AlertCircle className="w-6 h-6" />,
      content: [
        "Fraudulent activities: Permanent account ban, no refunds, legal action",
        "Chargeback disputes: Handled directly through Razorpay dispute resolution",
        "Account verification failure: Refund processed after successful KYC completion",
        "Prize money disputes: Separate from entry fee refunds, handled via support",
        "Seasonal tournaments: May have modified refund terms (clearly mentioned)",
        "Government regulation changes: Refund policy updated as per RBI/IT Act compliance",
        "Force majeure events: Full refunds or tournament credits as compensation",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Gaming Theme */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="w-12 h-12 text-orange-500 mr-4" />
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                GAMER PULSE
              </h1>
              <div className="text-orange-500 text-lg font-semibold tracking-wider">
                FREE FIRE TOURNAMENTS
              </div>
            </div>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-white mb-4">REFUND POLICY</h2>
          <div className="flex items-center justify-center mb-4">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mr-2">
              Powered by
            </span>
            <span className="text-blue-400 font-bold text-lg">Razorpay</span>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Secure payments and transparent refunds. All transactions processed
            through Razorpay's trusted payment gateway.
          </p>
        </div>

        {/* Razorpay Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
            <Clock className="w-8 h-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2">24HR</div>
            <div className="text-sm opacity-90">Refund Window</div>
          </div>
          <div className="bg-gray-800 border border-blue-500 p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
            <Smartphone className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2 text-blue-400">UPI</div>
            <div className="text-sm text-gray-300">Instant Refunds</div>
          </div>
          <div className="bg-gray-800 border border-orange-500 p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
            <Shield className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2 text-orange-500">100%</div>
            <div className="text-sm text-gray-300">Secure Gateway</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
            <IndianRupee className="w-8 h-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2">₹3-5</div>
            <div className="text-sm opacity-90">Processing Fee</div>
          </div>
        </div>

        {/* Payment Methods Supported */}
        <div className="mb-12 bg-gray-900 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-orange-500">
            Razorpay Supported Payment Methods
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-black rounded-lg p-4 mb-4">
                <CreditCard className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <h4 className="font-bold text-white">Cards & Banking</h4>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Credit/Debit Cards</li>
                <li>• Net Banking (58+ Banks)</li>
                <li>• EMI Options</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-black rounded-lg p-4 mb-4">
                <Smartphone className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <h4 className="font-bold text-white">UPI & Wallets</h4>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Google Pay, PhonePe</li>
                <li>• PayTM, BHIM</li>
                <li>• All UPI Apps</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-black rounded-lg p-4 mb-4">
                <IndianRupee className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <h4 className="font-bold text-white">Digital Wallets</h4>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Mobikwik, FreeCharge</li>
                <li>• Amazon Pay</li>
                <li>• International Cards</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {policyItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-orange-500 transition-colors"
            >
              <button
                onClick={() => toggleSection(item.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-orange-500">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
                <div className="text-orange-500">
                  {expandedSection === item.id ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </div>
              </button>

              {expandedSection === item.id && (
                <div className="px-6 pb-6">
                  <div className="bg-black rounded-lg p-6 border-l-4 border-orange-500">
                    <ul className="space-y-3">
                      {item.content.map((point, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Razorpay Integration Notice */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Secure Payments by Razorpay
          </h3>
          <p className="mb-6 opacity-90">
            All payments are processed through Razorpay's secure gateway with
            256-bit SSL encryption
          </p>
          <div className="text-sm opacity-80 mb-4">
            Licensed by Reserve Bank of India | PCI DSS Compliant | ISO 27001
            Certified
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help with Refunds?</h3>
          <p className="mb-6 opacity-90">
            Our payment support team is available 24/7 for refund assistance
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Refund Support
            </button>
            <button className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-lg font-semibold transition-colors">
              Check Refund Status
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="w-6 h-6 text-orange-500 mr-2" />
            <span className="text-orange-500 font-bold">GAMER PULSE</span>
            <span className="mx-2">|</span>
            <span className="text-blue-400">Powered by Razorpay</span>
          </div>
          <p className="text-sm mb-2">
            Last updated: September 2025 | Refund support:
            refunds@gamerpulse.com
          </p>
          <p className="text-xs opacity-60">
            All refunds subject to RBI guidelines and Razorpay terms of service
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
