import {
  CalendarDays,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useDashboard } from "@/hooks/GlobalHooks";

export function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  const today = format(new Date(), "EEEE, MMMM do yyyy");

  const stats = [
    {
      title: "Events Today",
      value: data?.total_events ?? 0,
      icon: <CalendarDays className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
      gradient: "from-blue-500/20 to-indigo-500/10",
    },
    {
      title: "Students Present",
      value: data?.total_present ?? 0,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      color: "text-emerald-600",
      gradient: "from-emerald-500/20 to-green-500/10",
    },
    {
      title: "Students Absent",
      value: data?.total_absent ?? 0,
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      color: "text-rose-600",
      gradient: "from-rose-500/20 to-red-500/10",
    },
    {
      title: "Total Students",
      value: data?.total_students ?? 0,
      icon: <Users className="w-5 h-5 text-purple-600" />,
      color: "text-purple-600",
      gradient: "from-purple-500/20 to-pink-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin w-8 h-8 mb-2" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-rose-500">
        <XCircle className="w-8 h-8 mb-2" />
        <p>Failed to load dashboard overview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6">
      <div className="text-center">
        <motion.h2
          className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard Overview
        </motion.h2>
        <p className="text-muted-foreground text-lg mt-2">{today}</p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
        }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            className={`rounded-2xl shadow-lg p-6 bg-gradient-to-br ${stat.gradient} backdrop-blur-xl border border-white/20`}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                {stat.title}
              </h3>
              {stat.icon}
            </div>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* STREAM INSIGHTS */}
      {data?.streams && data.streams.length > 0 && (
        <motion.div
          className="mt-10 bg-white/5 dark:bg-zinc-900/40 p-6 rounded-2xl shadow-md backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Stream Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.streams.map((stream, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-white/10"
              >
                <h4 className="text-lg font-semibold">{stream.stream}</h4>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Total Students</span>
                  <span>{stream.total_students}</span>
                </div>
                <div className="flex justify-between text-sm text-green-500 mt-1">
                  <span>Present</span>
                  <span>{stream.present}</span>
                </div>
                <div className="flex justify-between text-sm text-rose-500 mt-1">
                  <span>Absent</span>
                  <span>{stream.absent}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* EVENT INSIGHTS */}
      {data?.events && data.events.length > 0 && (
        <motion.div
          className="mt-10 bg-white/5 dark:bg-zinc-900/40 p-6 rounded-2xl shadow-md backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Today's Event Attendance
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
              <thead className="text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Stream</th>
                  <th className="px-4 py-2 text-green-500">Present</th>
                </tr>
              </thead>
              <tbody>
                {data.events.map((event, idx) => (
                  <tr
                    key={idx}
                    className="bg-gradient-to-r from-zinc-50/60 to-zinc-100/30 dark:from-zinc-800/60 dark:to-zinc-700/30 rounded-lg hover:shadow-lg transition-all"
                  >
                    <td className="px-4 py-3 font-medium">{event.title}</td>
                    <td className="px-4 py-3">{event.stream}</td>
                    <td className="px-4 py-3 text-green-500 font-semibold">
                      {event.present}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
