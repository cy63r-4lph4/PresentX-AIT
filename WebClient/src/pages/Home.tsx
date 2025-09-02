import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  FaGooglePlay,
  FaApple,
  FaUserShield,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        <motion.div className="absolute w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl top-[-100px] left-[-100px] animate-pulse" />
        <motion.div className="absolute w-72 h-72 bg-indigo-400 rounded-full opacity-10 blur-2xl bottom-[-60px] right-[-60px] animate-pulse" />

        <motion.h1
          className="text-5xl md:text-7xl font-extrabold drop-shadow-xl mb-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          AIT Attendance
        </motion.h1>
        <motion.h2
          className="text-lg md:text-2xl text-purple-200 font-light mb-10 max-w-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Powered by <span className="text-white font-semibold">Present X</span>{" "}
          — a revolutionary attendance solution redefining how universities
          track presence.
        </motion.h2>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-200 transition-colors duration-200"
          >
            <FaGooglePlay className="mr-2" /> Coming Soon
          </Button>
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-200 transition-colors duration-200"
          >
            <FaApple className="mr-2" /> Coming Soon
          </Button>
        </motion.div>
      </header>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-8 md:px-20 pb-24">
        {[
          {
            title: "Smart QR Attendance",
            description:
              "Seamless and secure attendance via dynamic QR codes and mobile scanning.",
          },
          {
            title: "Multi-Platform Access",
            description:
              "Accessible on both mobile and web for students, lecturers, and administrators.",
          },
          {
            title: "Built for Scale",
            description:
              "Present X is not just for AIT — it’s a scalable platform designed for modern campuses worldwide.",
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl transition-transform duration-300 hover:shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-200">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* AIT Admin & Lecturer Access */}
      <section className="bg-black/20 backdrop-blur-sm px-6 md:px-20 py-16">
        <h2 className="text-center text-2xl font-semibold text-white mb-8">
          AIT Admin & Lecturer Portals
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/su">
            <Card className="bg-white/10 hover:bg-white/20 transition rounded-xl border border-white/10 shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <FaUserShield size={28} className="text-purple-300" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Admin Dashboard
                  </h3>
                  <p className="text-sm text-gray-300">
                    Manage sessions, attendance, and analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/lecturer">
            <Card className="bg-white/10 hover:bg-white/20 transition rounded-xl border border-white/10 shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <FaChalkboardTeacher size={28} className="text-indigo-300" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Lecturer Dashboard
                  </h3>
                  <p className="text-sm text-gray-300">
                    Take attendance, reschedule classes, and more
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Note: These dashboards are specifically for AIT deployment of Present
          X.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 pb-6 mt-auto">
        <p>
          © 2025 Present X. Designed and engineered for global universities. AIT
          instance shown for demo purposes.
        </p>
      </footer>
    </div>
  );
}
