import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMyEvents } from "@/hooks/GlobalHooks";
import { streamIdToNameMap } from "@/components/Constants";
import { Loader2 } from "lucide-react";
import type { Event } from "@/components/Interfaces";

export default function AttendanceReport() {
  const { data: myEvents = [], isLoading } = useMyEvents();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [minCount, setMinCount] = useState("");
  const [maxCount, setMaxCount] = useState("");
  const [students, setStudents] = useState<any[]>([]); // Replace with your actual type

  // Temporary mocked student data for now
  const mockStudents = [
    { name: "Alice Johnson", matric: "MTS123", count: 3 },
    { name: "Bob Smith", matric: "MTS456", count: 6 },
    { name: "Charlie Doe", matric: "MTS789", count: 2 },
  ];

  const handleGenerate = () => {
    const min = minCount ? parseInt(minCount) : -Infinity;
    const max = maxCount ? parseInt(maxCount) : Infinity;

    const filtered = mockStudents.filter(
      (s) => s.count >= min && s.count <= max
    );

    setStudents(filtered);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="text-4xl">📊</span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-blue-600 text-transparent bg-clip-text">
            Attendance Report
          </h2>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl border border-blue-300/30">
        <CardContent className="space-y-6 p-6">
          {isLoading ? (
            <div className="text-center text-blue-500 animate-pulse space-y-2">
              <Loader2 className="animate-spin mx-auto h-8 w-8" />
              <p className="text-sm text-gray-300">Loading your events...</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Select Event</label>
                  <Select
                    value={selectedEvent}
                    onValueChange={setSelectedEvent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {myEvents.map((event: Event) => (
                        <SelectItem key={event.id} value={String(event.id)}>
                          {event.title} -{" "}
                          {(event.streams || [])
                            .map(
                              (id) =>
                                streamIdToNameMap[
                                  id as keyof typeof streamIdToNameMap
                                ] || id
                            )
                            .join(", ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Min Attendance
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 3"
                    value={minCount}
                    onChange={(e) => setMinCount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Max Attendance
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 6"
                    value={maxCount}
                    onChange={(e) => setMaxCount(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full sm:w-auto mt-2 px-6 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-blue-600 hover:to-emerald-500"
                onClick={handleGenerate}
                disabled={!selectedEvent}
              >
                Generate Report
              </Button>

              {students.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    🎓 Students Attendance Count
                  </h3>
                  <div className="overflow-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white border border-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 text-left border">Name</th>
                          <th className="py-2 px-4 text-left border">
                            Matric No
                          </th>
                          <th className="py-2 px-4 text-left border">
                            Attendance Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-2 px-4">{student.name}</td>
                            <td className="py-2 px-4">{student.matric}</td>
                            <td className="py-2 px-4 font-medium text-blue-600">
                              {student.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
