import {
  Home,
  CalendarClock,
  FileText,
  MessageCircle,
  Settings,
  Bell,
  UserCircle,
  Smartphone,
} from "lucide-react";
import { Outlet, NavLink, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: Home, path: "overview" },
  { name: "Timetable", icon: CalendarClock, path: "timetable" },
  { name: "Reports", icon: FileText, path: "reports" },
  { name: "Generate Token", icon: CalendarClock, path: "generate-token" },
  { name: "Reset Device", icon: Smartphone, path: "reset-device" },

  { name: "Feedback", icon: MessageCircle, path: "feedback" },
  { name: "Settings", icon: Settings, path: "settings" },
];

export default function SuperAdmin() {
  const routeTitles = {
    "/su/overview": "Dashboard Overview",
    "/su/timetable": "Timetable",
    "/su/reports": "Reports",
    "/su/feedback": "Feedback",
    "/su/settings": "Settings",
  };

  const location = useLocation();
  const currentTitle =
    routeTitles[location.pathname as keyof typeof routeTitles] || "Dashboard";
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        <div className="px-6 py-6 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
          Present X
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700"
                    : "text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-600"
                }`
              }
            >
              {" "}
              <Icon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition" />
              {name}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 text-xs text-gray-400">© 2025 Present X</div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl font-semi-bold font-italic text-gray-800 tracking-tight">
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
