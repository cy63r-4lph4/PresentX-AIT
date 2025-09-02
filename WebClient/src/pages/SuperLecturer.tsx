import { logOut } from "@/api/auth";
import { useAuth } from "@/auth/AuthContex";
import {
  QrCode,
  CalendarCheck,
  Users,
  LogOut,
  Bell,
  UserCircle,
  CalendarDays,
} from "lucide-react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const navItems = [
  { name: "My Timetable", icon: CalendarCheck, path: "timetable" },
  { name: "Generate QR", icon: QrCode, path: "generate-token" },
  { name: "Attendance", icon: Users, path: "attendance" },
  { name: "Reports", icon: CalendarDays, path: "report" },
  { name: "Logout", icon: LogOut, path: "logout" },
];

export default function SuperLecturer() {
  const routeTitles = {
    "/lecturer/timetable": "My Timetable",
    "/lecturer/generate-token": "Generate QR Code",
    "/lecturer/attendance": "Attendance Records",
    "/lecturer/logout": "Logout",
  };

  const location = useLocation();
  const currentTitle =
    routeTitles[location.pathname as keyof typeof routeTitles] ||
    "Lecturer Dashboard";
  const { logout } = useAuth();
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logOut();
      window.location.href = "/";
      logout();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 to-indigo-800 text-white shadow-lg flex flex-col">
        <div className="px-6 py-6 text-2xl font-extrabold text-white tracking-wide">
          Present X
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(({ name, icon: Icon, path }) =>
            path === "logout" ? (
              <button
                key={path}
                onClick={handleLogout}
                className="group flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-white/80 hover:bg-white/10 hover:text-white w-full text-left"
              >
                <Icon className="w-5 h-5" />
                {name}
              </button>
            ) : (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {name}
              </NavLink>
            )
          )}
        </nav>
        <div className="px-6 py-4 text-xs text-white/60">© 2025 Present X</div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            {currentTitle}
          </h1>
          <div className="flex items-center gap-5">
            <button className="relative group">
              <Bell className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </button>
            <UserCircle className="w-7 h-7 text-gray-600 hover:text-indigo-600 transition" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
