import { Bell, Clock } from "lucide-react";

const DashboardContent = ({ stats, matches }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-orange-500/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stat.change.startsWith("+")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-800 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-400" />
            Recent Notifications
          </h3>
          <div className="space-y-3">
            {[
              {
                message: "New player registered for Winter Championship",
                time: "2 min ago",
                type: "info",
              },
              {
                message: "Payment dispute reported by FireKing",
                time: "15 min ago",
                type: "warning",
              },
              {
                message: "Tournament 'Solo Masters' completed successfully",
                time: "1 hour ago",
                type: "success",
              },
              {
                message: "Server maintenance scheduled for tonight",
                time: "2 hours ago",
                type: "info",
              },
            ].map((notification, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30"
              >
                <div
                  className={`p-1 rounded-full mt-1 ${
                    notification.type === "success"
                      ? "bg-green-400/20"
                      : notification.type === "warning"
                      ? "bg-yellow-400/20"
                      : "bg-blue-400/20"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      notification.type === "success"
                        ? "bg-green-400"
                        : notification.type === "warning"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                    }`}
                  ></div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">
                    {notification.message}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-400" />
            Upcoming Matches
          </h3>
          <div className="space-y-3">
            {matches
              .filter(
                (match) =>
                  match.status === "Scheduled" || match.status === "Live"
              )
              .map((match) => (
                <div
                  key={match.id}
                  className="p-3 rounded-lg bg-gray-800/30 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{match.teams}</p>
                      <p className="text-gray-400 text-sm">
                        {match.tournament}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          match.status === "Live"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {match.status}
                      </span>
                      <p className="text-gray-400 text-sm mt-1">{match.time}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
