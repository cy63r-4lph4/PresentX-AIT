// pages/LecturerAttendance.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Loader2,
  Users,
  CheckCircle,
  GraduationCap,
  Hourglass,
} from "lucide-react";
import { useAttendance, useMyEvents } from "@/hooks/GlobalHooks";
import type { Event } from "@/components/Interfaces";
import { streamIdToNameMap } from "@/components/Constants";

export default function LecturerAttendance() {
  const [selectedCourse, setSelectedCourse] = useState<string>(
    () => localStorage.getItem("lastAttendanceCourse") || ""
  );

  const { data: myEvents = [], isLoading: eventsLoading } = useMyEvents();
  const { data, isLoading, error } = useAttendance(selectedCourse);

  useEffect(() => {
    if (selectedCourse) {
      localStorage.setItem("lastAttendanceCourse", selectedCourse);
    }
  }, [selectedCourse]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6">
      {/* Page Header */}
      <div className="text-center mb-4">
        <div className="flex justify-center items-center gap-2">
          <span className="text-4xl">📊</span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 text-transparent bg-clip-text">
            Attendance Dashboard
          </h2>
        </div>
        <p className="text-gray-500 mt-2 text-lg">
          View student attendance by course
        </p>
      </div>

      {/* Course Selection */}
      <Card className="border border-emerald-200 shadow-md">
        <CardContent className="p-6 space-y-4">
          {eventsLoading ? (
            <div className="text-center text-emerald-500 animate-pulse space-y-2">
              <Loader2 className="animate-spin mx-auto h-8 w-8" />
              <p className="text-sm">Loading your courses...</p>
            </div>
          ) : (
            <>
              <label className="text-sm font-medium text-gray-600">
                Select Course
              </label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {myEvents.map((event: Event) => (
                    <SelectItem key={event.id} value={String(event.id)}>
                      {event.title} –{" "}
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Attendance Content */}
      {!selectedCourse ? (
        <div className="text-center text-gray-400 italic">
          <GraduationCap className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
          Please select a course to view attendance.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">
          Failed to load attendance: {error.message}
        </p>
      ) : !data ? (
        <div className="text-center text-gray-400 italic">
          <Hourglass className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
          No attendance records available for this course yet.
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="shadow-lg border border-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Users className="h-5 w-5" /> Registered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-800">
                  {data.registered_count}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="h-5 w-5" /> Present
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-800">
                  {data.total_present}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  Turnover Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-800">
                  {data.turnover_rate}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Registered vs Unregistered */}
          <Tabs defaultValue="registered" className="w-full mt-8">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="registered">Registered Students</TabsTrigger>
              <TabsTrigger value="unregistered">
                Unregistered Students
              </TabsTrigger>
            </TabsList>

            {/* Registered Students */}
            <TabsContent value="registered">
              {data.students.registered.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">
                  No registered students attended yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {data.students.registered.map((s) => (
                    <Card
                      key={s.id}
                      className="shadow-md border border-gray-200 rounded-xl hover:shadow-lg transition"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-800">
                          {s.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          ID: {s.student_id}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Stream:</span>{" "}
                          {s.stream ?? "—"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Method:</span>{" "}
                          {s.method}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Time:</span> {s.time}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Unregistered Students */}
            <TabsContent value="unregistered">
              {data.students.unregistered.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">
                  No unregistered students attended yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {data.students.unregistered.map((s) => (
                    <Card
                      key={s.id}
                      className="shadow-md border border-yellow-200 bg-yellow-50 rounded-xl hover:shadow-lg transition"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-800">
                          {s.name ?? "Unknown Student"}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          ID: {s.student_id}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Method:</span>{" "}
                          {s.method}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Time:</span> {s.time}
                        </p>
                        <p className="text-sm text-yellow-700">
                          ⚠ Not yet registered
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
