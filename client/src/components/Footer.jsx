import {
  Trophy,
  Users,
  Shield,
  Zap,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Gamepad2,
  Star,
  Award,
  Target,
  Flame,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Join Tournament", href: "/tournament" },
      { name: "Leaderboards", href: "/tournament" },
      { name: "Player Stats", href: "/tournament" },
      { name: "Tournament History", href: "/tournament" },
    ],
    support: [
      { name: "Contact Support", href: "/contact" },
      { name: "Privacy Policy And Rules", href: "/privacy-policy-rules" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Bug Reports", href: "/contact" },
    ],
    company: [
      { name: "About Gamer Pulse", href: "/about-us" },
      { name: "Partnerships", href: "/partnerships" },
      { name: "Investors", href: "/investors" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "hover:text-blue-600",
    },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "hover:text-pink-500",
    },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
    {
      name: "Discord",
      icon: MessageCircle,
      href: "#",
      color: "hover:text-purple-600",
    },
  ];

  const achievements = [
    { icon: Trophy, value: "2.5K+", label: "Tournaments" },
    { icon: Users, value: "250K+", label: "Players" },
    { icon: Award, value: "$2M+", label: "Prize Pool" },
    { icon: Star, value: "4.9/5", label: "Rating" },
  ];

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900">
        <div className="absolute top-20 left-10 w-24 h-24 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-10 w-10 text-orange-500" />
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Gamer Pulse
                </h3>
                <p className="text-sm text-orange-400 font-semibold">
                  Esports Unleashed
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Join the ultimate Free Fire tournament platform. Compete, win, and
              rise to glory with millions of players worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 ${social.color}`}
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h4 className="text-orange-400 font-semibold text-sm uppercase flex items-center">
              <Target className="h-5 w-5 mr-2" /> Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-orange-400 font-semibold text-sm uppercase flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-orange-400 font-semibold text-sm uppercase flex items-center">
              <Flame className="h-5 w-5 mr-2" /> Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-orange-500/20">
                    <IconComponent className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="text-lg font-semibold text-orange-400">
                    {achievement.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold flex items-center">
                <Zap className="h-6 w-6 text-orange-400 mr-2" /> Stay in the
                Game
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Subscribe for tournament updates, gaming tips, and exclusive
                offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your gaming email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>© {currentYear} Gamer Pulse. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="/privacy-policy-rules" className="hover:text-orange-400 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-service" className="hover:text-orange-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
