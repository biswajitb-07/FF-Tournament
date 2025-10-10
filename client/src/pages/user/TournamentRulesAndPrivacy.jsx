import React, { useState } from "react";
import {
  Shield,
  FileText,
  Users,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gamepad2,
  Eye,
  Lock,
  Server,
  UserCheck,
  Zap,
  Target,
  Award,
  Ban,
} from "lucide-react";

const TournamentRulesAndPrivacy = () => {
  const [activeTab, setActiveTab] = useState("rules");

  const TabButton = ({ id, icon: Icon, title, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 text-sm md:text-lg px-6 py-4 rounded-t-lg font-semibold transition-all duration-300 ${
        isActive
          ? "bg-orange-500 text-black shadow-lg transform -translate-y-1"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-orange-400"
      }`}
    >
      <Icon size={20} />
      {title}
    </button>
  );

  const SectionCard = ({ icon: Icon, title, children, highlight = false }) => (
    <div
      className={`bg-gray-800 rounded-lg p-6 border-l-4 ${
        highlight
          ? "border-orange-500 bg-gradient-to-r from-orange-900/20 to-gray-800"
          : "border-gray-600"
      } hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="text-orange-500" size={24} />
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  const RuleItem = ({ icon: Icon, text, important = false }) => (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        important
          ? "bg-orange-900/30 border border-orange-500/30"
          : "bg-gray-700/50"
      }`}
    >
      <Icon
        className={important ? "text-orange-400 mt-1" : "text-gray-400 mt-1"}
        size={16}
      />
      <p
        className={`text-sm ${important ? "text-orange-100" : "text-gray-300"}`}
      >
        {text}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900/20 p-6 pt-[6rem] lg:pt-[7.5rem]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Free Fire Tournament
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            Rules, Regulations & Privacy Policy
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-900 rounded-t-lg p-1">
            <TabButton
              id="rules"
              icon={Trophy}
              title="Tournament Rules"
              isActive={activeTab === "rules"}
              onClick={setActiveTab}
            />
            <TabButton
              id="privacy"
              icon={Shield}
              title="Privacy Policy"
              isActive={activeTab === "privacy"}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Tournament Rules Tab */}
        {activeTab === "rules" && (
          <div className="space-y-6 animate-fadeIn">
            {/* General Rules */}
            <SectionCard
              icon={FileText}
              title="General Tournament Rules"
              highlight
            >
              <div className="space-y-3">
                <RuleItem
                  icon={UserCheck}
                  text="All participants must be registered with valid Free Fire UID and verified contact information."
                  important
                />
                <RuleItem
                  icon={Clock}
                  text="Players must join the custom room 10 minutes before the scheduled match time."
                />
                <RuleItem
                  icon={Users}
                  text="Maximum team size is 4 players. Solo and duo tournaments will be specified separately."
                />
                <RuleItem
                  icon={Zap}
                  text="Late entries will not be allowed after registration closes."
                  important
                />
              </div>
            </SectionCard>

            {/* Game Rules */}
            <SectionCard icon={Gamepad2} title="Gameplay Rules">
              <div className="space-y-3">
                <RuleItem
                  icon={Target}
                  text="Only Battle Royale Classic mode is allowed unless specified otherwise."
                />
                <RuleItem
                  icon={CheckCircle}
                  text="Custom room settings will be provided by tournament organizers 30 minutes before match."
                />
                <RuleItem
                  icon={AlertTriangle}
                  text="Players must use their registered character names and UIDs during matches."
                  important
                />
                <RuleItem
                  icon={Server}
                  text="Default server will be specified in tournament details. All players must join the same server."
                />
              </div>
            </SectionCard>

            {/* Prohibited Actions */}
            <SectionCard icon={Ban} title="Prohibited Actions">
              <div className="space-y-3">
                <RuleItem
                  icon={AlertTriangle}
                  text="Use of any hacks, cheats, or third-party applications is strictly prohibited."
                  important
                />
                <RuleItem
                  icon={Ban}
                  text="Teaming with other squads or players outside your registered team is forbidden."
                  important
                />
                <RuleItem
                  icon={AlertTriangle}
                  text="Abusive language, toxic behavior, or harassment will result in immediate disqualification."
                  important
                />
                <RuleItem
                  icon={Ban}
                  text="Using emulators is prohibited unless it's an emulator-specific tournament."
                />
                <RuleItem
                  icon={AlertTriangle}
                  text="Stream sniping or gaining unfair advantages through external information is banned."
                />
              </div>
            </SectionCard>

            {/* Scoring System */}
            <SectionCard icon={Award} title="Scoring & Ranking System">
              <div className="space-y-3">
                <RuleItem
                  icon={Trophy}
                  text="Booyah (1st Place): 12 points + Kill points"
                />
                <RuleItem
                  icon={Award}
                  text="2nd Place: 6 points + Kill points | 3rd Place: 4 points + Kill points"
                />
                <RuleItem icon={Target} text="Each elimination: 1 point" />
                <RuleItem
                  icon={CheckCircle}
                  text="Rankings are based on total points across all matches in the tournament."
                />
              </div>
            </SectionCard>

            {/* Prize Distribution */}
            <SectionCard icon={Trophy} title="Prize Distribution">
              <div className="space-y-3">
                <RuleItem
                  icon={Award}
                  text="Prizes will be distributed within 7 working days after tournament completion."
                />
                <RuleItem
                  icon={UserCheck}
                  text="Winners must provide valid payment details and identity verification."
                  important
                />
                <RuleItem
                  icon={CheckCircle}
                  text="Prize distribution is subject to tax deductions as per local regulations."
                />
              </div>
            </SectionCard>

            {/* Technical Issues */}
            <SectionCard
              icon={AlertTriangle}
              title="Technical Issues & Disputes"
            >
              <div className="space-y-3">
                <RuleItem
                  icon={Server}
                  text="In case of server issues, matches may be rescheduled or restarted as per admin decision."
                />
                <RuleItem
                  icon={Clock}
                  text="Players have 5 minutes to report technical issues after match completion."
                />
                <RuleItem
                  icon={Eye}
                  text="All matches may be recorded for verification and dispute resolution."
                />
                <RuleItem
                  icon={CheckCircle}
                  text="Tournament admin decisions are final and binding."
                  important
                />
              </div>
            </SectionCard>
          </div>
        )}

        {/* Privacy Policy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Information Collection */}
            <SectionCard icon={Eye} title="Information We Collect" highlight>
              <div className="space-y-3">
                <RuleItem
                  icon={UserCheck}
                  text="Personal information: Name, email address, phone number, and Free Fire UID."
                />
                <RuleItem
                  icon={Gamepad2}
                  text="Game data: Match statistics, gameplay recordings, and tournament performance."
                />
                <RuleItem
                  icon={Server}
                  text="Technical data: IP address, device information, and connection details for anti-cheat purposes."
                />
              </div>
            </SectionCard>

            {/* How We Use Information */}
            <SectionCard icon={Target} title="How We Use Your Information">
              <div className="space-y-3">
                <RuleItem
                  icon={Trophy}
                  text="Tournament management: Registration, match coordination, and prize distribution."
                />
                <RuleItem
                  icon={Shield}
                  text="Security: Preventing cheating, fraud, and maintaining fair play environment."
                />
                <RuleItem
                  icon={CheckCircle}
                  text="Communication: Sending tournament updates, match schedules, and important announcements."
                />
                <RuleItem
                  icon={Award}
                  text="Analytics: Improving our services and understanding tournament engagement."
                />
              </div>
            </SectionCard>

            {/* Data Protection */}
            <SectionCard icon={Lock} title="Data Protection & Security">
              <div className="space-y-3">
                <RuleItem
                  icon={Shield}
                  text="We implement industry-standard security measures to protect your personal information."
                  important
                />
                <RuleItem
                  icon={Server}
                  text="Data is encrypted during transmission and stored on secure servers."
                />
                <RuleItem
                  icon={Lock}
                  text="Access to personal information is restricted to authorized personnel only."
                />
                <RuleItem
                  icon={AlertTriangle}
                  text="We will never sell your personal information to third parties."
                  important
                />
              </div>
            </SectionCard>

            {/* Information Sharing */}
            <SectionCard icon={Users} title="Information Sharing">
              <div className="space-y-3">
                <RuleItem
                  icon={Trophy}
                  text="Tournament results and leaderboards may be publicly displayed."
                />
                <RuleItem
                  icon={Eye}
                  text="Match recordings may be shared for promotional or educational purposes."
                />
                <RuleItem
                  icon={Shield}
                  text="Personal information is only shared when required by law or for fraud prevention."
                />
              </div>
            </SectionCard>

            {/* User Rights */}
            <SectionCard icon={UserCheck} title="Your Rights">
              <div className="space-y-3">
                <RuleItem
                  icon={Eye}
                  text="Right to access: Request a copy of your personal data we hold."
                />
                <RuleItem
                  icon={FileText}
                  text="Right to correction: Request correction of inaccurate personal information."
                />
                <RuleItem
                  icon={Ban}
                  text="Right to deletion: Request deletion of your personal data (subject to legal requirements)."
                />
                <RuleItem
                  icon={Lock}
                  text="Right to withdraw consent: Unsubscribe from communications at any time."
                />
              </div>
            </SectionCard>

            {/* Contact Information */}
            <SectionCard icon={FileText} title="Contact Us">
              <div className="space-y-3">
                <RuleItem
                  icon={UserCheck}
                  text="For privacy concerns or data requests, contact our data protection team."
                />
                <RuleItem
                  icon={Clock}
                  text="We will respond to all privacy-related inquiries within 72 hours."
                />
                <RuleItem
                  icon={CheckCircle}
                  text="This privacy policy is effective as of the tournament launch date and may be updated periodically."
                />
              </div>
            </SectionCard>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString()} |
            <span className="text-orange-400 ml-1">
              Free Fire Tournament Platform
            </span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            By participating in our tournaments, you agree to these rules and
            privacy policy.
          </p>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TournamentRulesAndPrivacy;
