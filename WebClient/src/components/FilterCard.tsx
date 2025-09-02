import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function AttendanceFilter({
  methodFilter,
  setMethodFilter,
  searchTerm,
  setSearchTerm,
}: {
  methodFilter: "all" | "qr" | "sms" | "scan";
  setMethodFilter: (val: "all" | "qr" | "sms" | "scan") => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:gap-6 mb-8 bg-white shadow-md p-6 rounded-2xl">
      {/* Date Display */}
      <div className="text-xl font-semibold text-gray-700">
        🗓️ Attendance Summary for <span className="text-purple-600">{formatDate(new Date())}</span>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="🔍 Search by name or ID"
          className="w-full md:w-1/2 rounded-xl border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-full md:w-[200px] rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-300 transition">
            <SelectValue placeholder="Filter by method" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg border border-gray-200">
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="qr">QR Code</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="scan">Manual Scan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
