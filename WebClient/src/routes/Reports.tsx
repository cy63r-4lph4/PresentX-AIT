import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export function Reports() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setReportData({
        title: "Sample Report",
        attendees: 42,
        date: "2025-08-01",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="text-4xl">📊</span>
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-center">
            Generate Attendance Report
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Event Title */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Event Title
          </label>
          <Input placeholder="e.g., CSC102 Midterm Class" className="mt-1" />
        </div>

        {/* Date Range */}
        <div>
          <label className="text-sm font-medium text-gray-700">Date</label>
          <div className="relative mt-1">
            <Input type="date" className="pr-10" />
            <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Stream */}
        <div>
          <label className="text-sm font-medium text-gray-700">Stream</label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select stream" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Seaview Regular">Seaview Regular</SelectItem>
              <SelectItem value="KCC Evening">KCC Evening</SelectItem>
              <SelectItem value="KCC Weekend">KCC Weekend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hall */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Lecture Hall
          </label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select hall" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Auditorium A">Auditorium A</SelectItem>
              <SelectItem value="Hall 3">Hall 3</SelectItem>
              <SelectItem value="Lab 2">Lab 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-center">
        <Button
          size="lg"
          className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform duration-300"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Generate Report
            </>
          )}
        </Button>
      </div>

      {/* Report Preview */}
      {reportData && (
        <Card className="mt-6 shadow-2xl border border-gray-300 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-2xl font-bold text-purple-700">
              {reportData.title}
            </h3>
            <p className="text-gray-700">🗓️ Date: {reportData.date}</p>
            <p className="text-gray-700">
              👥 Total Attendees: {reportData.attendees}
            </p>
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
              Download Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
