import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAttendanceStats } from "@/hooks/useAttendanceStats";
import { ProgressBar } from "react-native-paper";
import { MotiView, MotiText } from "moti";

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
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400 }}
      className="mb-8"
    >
      {/* Summary Header */}
      <LinearGradient
        colors={["#6C47FF", "#8F5FFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5 rounded-2xl mb-4 shadow-md"
      >
        <MotiText
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 200 }}
          className="text-white text-lg font-semibold mb-1"
        >
          Attendance Summary
        </MotiText>
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
        {stats.map((course, index) => {
          const high = course.attendance_percentage >= 75;
          const gradientColors = high
            ? ["#E6FFF2", "#D1FAE5"]
            : ["#FFF1F1", "#FFECEC"];

          return (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 150 * (index + 1) }}
              className="mb-3"
            >
              <LinearGradient
                colors={gradientColors as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 rounded-2xl border border-white shadow-sm"
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
                      high ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {course.attendance_percentage}%
                  </Text>
                </View>

                <ProgressBar
                  progress={course.attendance_percentage / 100}
                  color={high ? "#22C55E" : "#EF4444"}
                  style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#e5e7eb",
                  }}
                />
                <Text
                  className={`text-xs mt-1 ${
                    high ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {high ? "✅ Eligible for exams" : "⚠️ Attendance at risk"}
                </Text>
              </LinearGradient>
            </MotiView>
          );
        })}
      </View>
    </MotiView>
  );
};
