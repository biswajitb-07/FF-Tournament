import { useState } from "react";
import {
  Shield,
  Trophy,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Gamepad2,
  Star,
  Ban,
  UserX,
  Crown,
} from "lucide-react";

const TermsOfService = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "eligibility",
      icon: Users,
      title: "Player Eligibility",
      content: [
        "Must be 16+ years old or have parental consent",
        "Valid Free Fire account required",
        "No banned or suspended accounts allowed",
        "One account per player policy strictly enforced",
      ],
    },
    {
      id: "registration",
      icon: FileText,
      title: "Tournament Registration",
      content: [
        "Entry fees are non-refundable after registration",
        "Players must provide accurate information",
        "Team captains responsible for all team members",
      ],
    },
    {
      id: "gameplay",
      icon: Gamepad2,
      title: "Gameplay Rules",
      content: [
        "Use of hacks, cheats, or exploits results in immediate disqualification and gameId ban in this app",
        "Players must join matches within 10 minutes of invitation",
        "Screenshots/recordings may be required as proof",
        "All matches played on specified server regions only",
      ],
    },
    {
      id: "prizes",
      icon: Trophy,
      title: "Prize Distribution",
      content: [
        "Prizes distributed within 7-14 business days after tournament",
        "Winners must provide valid payment information",
        "Tax obligations are winner's responsibility",
        "Prizes may be substituted with equivalent value items",
      ],
    },
    {
      id: "conduct",
      icon: Shield,
      title: "Code of Conduct",
      content: [
        "Respectful behavior required at all times",
        "No harassment, toxicity, or discrimination",
        "English communication in official channels",
        "Violations may result in permanent tournament bans",
      ],
    },
    {
      id: "disputes",
      icon: AlertTriangle,
      title: "Disputes & Appeals",
      content: [
        "All decisions by tournament staff are final",
        "Appeals must be submitted within 24 hours",
        "Evidence required for all dispute claims",
        "Repeated false claims may result in penalties",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-[2.4rem] lg:pt-[5rem]">
      {/* Header */}
      <div className="relative overflow-hidden bg-black px-6 py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-xl md:text-2xl lg:text-4xl font-bold tracking-tight">
            Tournament Terms of Service
          </h1>
          <p className="text-sm md:text-lg text-orange-100">
            Please read these terms carefully before participating in our Free
            Fire tournaments
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-orange-200">
            <Clock className="h-4 w-4" />
            <span>Last updated: September 19, 2025</span>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-orange-400">
            <Star className="h-6 w-6" />
            Quick Summary
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Fair Play Required</h3>
                <p className="text-gray-300 text-sm">
                  No cheating, hacking, or exploiting allowed
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Respect Others</h3>
                <p className="text-gray-300 text-sm">
                  Maintain respectful communication always
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Follow Schedule</h3>
                <p className="text-gray-300 text-sm">
                  Join matches on time and be prepared
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Valid Account</h3>
                <p className="text-gray-300 text-sm">
                  Use legitimate Free Fire accounts only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Terms */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-8 text-3xl font-bold text-center">
          Detailed Terms & Conditions
        </h2>

        <div className="space-y-4">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                className="rounded-xl bg-gray-900/50 border border-gray-800 overflow-hidden hover:border-orange-500/30 transition-all duration-300"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-orange-500/20 p-2">
                        <IconComponent className="h-5 w-5 text-orange-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {section.title}
                      </h3>
                    </div>
                    <div
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-700 pt-4">
                      <ul className="space-y-3">
                        {section.content.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="rounded-full bg-orange-500/20 p-1 mt-1">
                              <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                            </div>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Warning Section */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-red-500/20 p-2 flex-shrink-0">
              <Ban className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="mb-3 text-xl font-bold text-red-400">
                Violations & Penalties
              </h3>
              <p className="text-gray-300 mb-4">
                Violation of these terms may result in immediate
                disqualification, prize forfeiture, and permanent ban from
                future tournaments.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-300">
                    Account suspension
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-300">Tournament ban</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-300">
                    Prize forfeiture
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-300">
                    Legal action if applicable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="rounded-xl bg-gray-900/30 p-6 border border-gray-800">
            <p className="text-gray-400 mb-4">
              By participating in our tournaments, you acknowledge that you have
              read, understood, and agree to these terms.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>© 2025 Free Fire Tournaments</span>
              <span>•</span>
              <span>Contact: support@ffretournaments.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
