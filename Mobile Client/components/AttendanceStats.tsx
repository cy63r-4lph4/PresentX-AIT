import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAttendanceStats } from "@/hooks/useAttendanceStats";
import { ProgressBar } from "react-native-paper";

export const AttendanceStats = () => {
  const { stats, summary, loading, error } = useAttendanceStats();

  if (loading)
    return (
      <View className="bg-[#f9f9ff] p-6 rounded-2xl mb-6 shadow-sm items-center justify-center">
        <ActivityIndicator color="#611FE7" />
        <Text className="text-gray-500 mt-2">Fetching your statistics...</Text>
      </View>
    );

  if (error)
    return (
      <View className="bg-[#fff5f5] p-4 rounded-2xl mb-6 shadow-sm">
        <Text className="text-red-600 font-medium text-center">{error}</Text>
      </View>
    );

  if (!stats || stats.length === 0)
    return (
      <View className="bg-[#f9f9ff] p-4 rounded-2xl mb-6 shadow-sm">
        <Text className="text-gray-500 text-center">
          No attendance statistics available
        </Text>
      </View>
    );

  return (
    <View className="mb-8">
      {/* Header Summary */}
      <LinearGradient
        colors={["#6C47FF", "#8F5FFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5 rounded-2xl mb-4 shadow-sm"
      >
        <Text className="text-white text-lg font-semibold mb-1">
          Attendance Summary
        </Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-white text-4xl font-bold">
              {summary.overall_attendance ?? 0}%
            </Text>
            <Text className="text-white/80 text-sm">
              Average Attendance Rate
            </Text>
          </View>
          <View className="items-end justify-center">
            <Text className="text-white text-base">
              {summary.total_courses} Courses
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Per-course stats */}
      <View>
        {stats.map((course, index) => (
          <View
            key={index}
            className="bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm"
          >
            <View className="flex-row justify-between mb-1">
              <View className="flex-1">
                <Text className="text-[#611FE7] text-base font-semibold">
                  {course.course}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {course.attended_sessions}/{course.total_sessions_so_far}{" "}
                  sessions
                </Text>
              </View>
              <Text
                className={`text-base font-bold ${
                  course.attendance_percentage >= 75
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {course.attendance_percentage}%
              </Text>
            </View>

            <ProgressBar
              progress={course.attendance_percentage / 100}
              color={course.attendance_percentage >= 75 ? "#22C55E" : "#EF4444"}
              style={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "#f0f0f0",
              }}
            />
            <Text
              className={`text-xs mt-1 ${
                course.attendance_percentage >= 75
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {course.attendance_percentage >= 75
                ? "✅ Eligible for exams"
                : "⚠️ Attendance at risk"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
