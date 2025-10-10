import {
  Trophy,
  Users,
  Zap,
  Shield,
  Target,
  Gamepad2,
  Award,
  Clock,
} from "lucide-react";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Championship Tournaments",
      description:
        "Host and participate in competitive Free Fire tournaments with real prizes and recognition.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description:
        "Connect with thousands of passionate Free Fire players and build lasting gaming relationships.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Seamless tournament registration and real-time match updates for the ultimate gaming experience.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Fair Play Guarantee",
      description:
        "Advanced anti-cheat systems and moderation ensure competitive integrity in every match.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Players" },
    { number: "1000+", label: "Tournaments Hosted" },
    { number: "₹10L+", label: "Prize Money Distributed" },
    { number: "24/7", label: "Support Available" },
  ];

  const team = [
    {
      name: "Alex Rivera",
      role: "Founder & CEO",
      description: "Former pro gamer with 5+ years in esports management",
    },
    {
      name: "Priya Sharma",
      role: "Tournament Director",
      description:
        "Expert in competitive gaming with tournament organization experience",
    },
    {
      name: "David Chen",
      role: "Technical Lead",
      description:
        "Full-stack developer specializing in real-time gaming platforms",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-[2rem] lg:pt-[5rem]">
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-orange-900 py-16 px-4">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <Gamepad2 className="w-7 h-7 md:w-12 md:h-12 text-orange-500" />
            <h1 className="text-xl md:text-2xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Game Pulse
            </h1>
          </div>
          <p className="text-sm md:text-base lg:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            India's premier Free Fire tournament hosting platform, where
            champions are born and legends are made. Join the pulse of
            competitive gaming.
          </p>
          <div className="flex justify-center">
            <Target className="w-16 h-16 text-orange-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg md:text-xl lg:text-4xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium text-base md:text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-base md:text-xl text-gray-300 leading-relaxed mb-12">
            At Game Pulse, we're revolutionizing competitive Free Fire gaming in
            India. We believe every player deserves a platform to showcase their
            skills, compete fairly, and grow within a supportive community. Our
            cutting-edge technology ensures seamless tournament experiences
            while our dedicated team maintains the highest standards of
            competitive integrity.
          </p>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-1 w-24 mx-auto"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Why Choose Game Pulse?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black p-8 rounded-xl border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 group"
              >
                <div className="text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Our Story
          </h2>
          <div className="space-y-8 text-gray-300">
            <p className="text-base md:text-lg leading-relaxed text-center">
              Game Pulse was born from a simple observation: India's Free Fire
              community needed a professional, reliable platform for competitive
              gaming. Founded in 2023 by passionate gamers and tech enthusiasts,
              we set out to create more than just another tournament platform.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-center">
              We envisioned a space where skill meets opportunity, where every
              player—from casual enthusiasts to aspiring professionals—could
              find their place in the competitive ecosystem. Today, we're proud
              to be India's fastest-growing Free Fire tournament platform,
              trusted by thousands of players nationwide.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-center">
              Our journey is just beginning. With continuous innovation,
              community feedback, and an unwavering commitment to fair play,
              we're building the future of competitive mobile gaming in India.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-10 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center bg-black p-8 rounded-xl border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-base md:text-xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-500 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl lg:text-4xl font-bold mb-12 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Award className="w-8 h-8 lg:w-12 lg:h-12 text-orange-500 mx-auto" />
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-white">
                Excellence
              </h3>
              <p className="text-gray-400">
                We strive for perfection in every tournament, every feature, and
                every interaction.
              </p>
            </div>
            <div className="space-y-4">
              <Shield className="w-8 h-8 lg:w-12 lg:h-12 text-orange-500 mx-auto" />
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-white">
                Integrity
              </h3>
              <p className="text-gray-400">
                Fair play and transparency are the foundations of everything we
                do.
              </p>
            </div>
            <div className="space-y-4">
              <Users className="w-8 h-8 lg:w-12 lg:h-12 text-orange-500 mx-auto" />
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-white">
                Community
              </h3>
              <p className="text-gray-400">
                We're building more than a platform—we're fostering a gaming
                family.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-10 bg-gradient-to-r from-orange-600 to-orange-700 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Clock className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6">
            Ready to Join the Action?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-orange-100 mb-8">
            Don't miss out on the next big tournament. Register now and become
            part of India's premier Free Fire community.
          </p>
          <button className="bg-black text-white px-8 py-4 rounded-lg font-bold text-base md:text-lg hover:bg-gray-900 transition-colors duration-300 shadow-lg">
            Join Tournament Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
