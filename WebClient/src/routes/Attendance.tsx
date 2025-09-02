import { AttendanceTable } from "@/components/AttendanceTable";
import { AttendanceFilter } from "@/components/FilterCard";
import { TurnoverCard } from "@/components/TurnoverCard";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

type Method = "all" | "qr" | "sms" | "scan";
interface Student {
  id: number;
  name: string;
  student_id: string;
  stream: string;
  method: Method;
  time: string;
}

export default function Attendance() {
  const allstudnets = 100;
  const presentStudents: Student[] = [
    {
      id: 1,
      name: "Ama Boateng",
      student_id: "KCC/23/1010",
      stream: "KCC Weekend",
      method: "qr",
      time: "08:15 AM",
    },
    {
      id: 2,
      name: "Kwame Mensah",
      student_id: "KCC/23/1011",
      stream: "KCC Weekend",
      method: "sms",
      time: "08:22 AM",
    },
    {
      id: 3,
      name: "Esi Owusu",
      student_id: "KCC/23/1012",
      stream: "KCC Weekend",
      method: "scan",
      time: "08:09 AM",
    },
    {
      id: 4,
      name: "Yaw Frimpong",
      student_id: "KCC/23/1013",
      stream: "KCC Weekend",
      method: "qr",
      time: "08:33 AM",
    },
    {
      id: 10,
      name: "Akua Dapaah",
      student_id: "KCC/23/1014",
      stream: "KCC Weekend",
      method: "sms",
      time: "08:05 AM",
    },
    {
      id: 5,
      name: "Kojo Asante",
      student_id: "KCC/23/1015",
      stream: "KCC Weekend",
      method: "scan",
      time: "08:40 AM",
    },
    {
      id: 6,
      name: "Serwaa Darko",
      student_id: "KCC/23/1016",
      stream: "KCC Weekend",
      method: "qr",
      time: "08:11 AM",
    },
    {
      id: 7,
      name: "Joseph Arhin",
      student_id: "KCC/23/1017",
      stream: "KCC Weekend",
      method: "scan",
      time: "08:18 AM",
    },
    {
      id: 8,
      name: "Afia Nkansah",
      student_id: "KCC/23/1018",
      stream: "KCC Weekend",
      method: "qr",
      time: "08:26 AM",
    },
    {
      id: 9,
      name: "Daniel Ofori",
      student_id: "KCC/23/1019",
      stream: "KCC Weekend",
      method: "sms",
      time: "08:31 AM",
    },
  ];
  const today = format(new Date(), "EEEE, MMMM d, yyyy");
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<Method>("qr");

  const filteredStudents = presentStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === "all" || s.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
  <div className="p-6 space-y-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 min-h-screen">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Attendance Overview
      </h2>

      {/* Date Card */}
      <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full">
        <CalendarDays className="h-4 w-4" />
        {today}
      </div>
    </div>

    {/* Conditional Rendering */}
    {presentStudents.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-white border border-dashed border-gray-300 rounded-lg shadow-sm">
        <div className="p-4 bg-indigo-100 rounded-full">
          <CalendarDays className="w-10 h-10 text-indigo-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">No Attendance Yet</h3>
        <p className="text-gray-500 text-center max-w-sm">
          Attendance for this course hasn’t been marked yet today. Once students start checking in, you'll see their names and methods here.
        </p>
      </div>
    ) : (
      <>
        <TurnoverCard total={allstudnets} present={presentStudents.length} />

        <AttendanceFilter
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <AttendanceTable students={filteredStudents} />
      </>
    )}
  </div>
);

}
