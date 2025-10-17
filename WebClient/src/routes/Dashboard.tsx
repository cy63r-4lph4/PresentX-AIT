import { useEffect, useState } from "react";
import { CalendarDays, Users, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export function Dashboard() {
  const [today, setToday] = useState("");
  const [totalEvents, setTotalEvents] = useState(3); // replace with actual API call
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(1);
  const [totalStudents, setTotalStudents] = useState(1);

  useEffect(() => {
    setToday(format(new Date(), "EEEE, MMMM do yyyy"));
  }, []);

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="text-4xl">🧠 </span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-blue-600 text-transparent bg-clip-text text-center">
            Admin Dashboard Overview
          </h2>
        </div>
      </div>

      <p className="text-center text-muted-foreground text-lg">{today}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl shadow-md p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              Events Today
            </h3>
            <CalendarDays className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalEvents}</p>
        </div>

        <div className="rounded-2xl shadow-md p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              Students Present
            </h3>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{totalPresent}</p>
        </div>

        <div className="rounded-2xl shadow-md p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              Students Absent
            </h3>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-3xl font-bold text-rose-600">{totalAbsent}</p>
        </div>

        <div className="rounded-2xl shadow-md p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              Total Students
            </h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{totalStudents}</p>
        </div>
      </div>
    </div>
  );
}
