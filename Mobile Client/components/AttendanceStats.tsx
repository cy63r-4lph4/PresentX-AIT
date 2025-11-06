// components/AttendanceStats.tsx
import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useStudentCourses } from "@/hooks/useStudentCourses";

export const AttendanceStats = () => {
  const { courses, loading, error } = useStudentCourses();

  if (loading)
    return (
      <View className="bg-[#f9f9ff] p-4 rounded-2xl mb-6 shadow-sm items-center justify-center">
        <ActivityIndicator color="#611FE7" />
        <Text className="text-gray-500 mt-2">Fetching attendance...</Text>
      </View>
    );

  if (error)
    return (
      <View className="bg-[#fff5f5] p-4 rounded-2xl mb-6 shadow-sm">
        <Text className="text-red-600 font-medium text-center">{error}</Text>
      </View>
    );

  if (!courses || courses.length === 0)
    return (
      <View className="bg-[#f9f9ff] p-4 rounded-2xl mb-6 shadow-sm">
        <Text className="text-gray-500 text-center">No courses found</Text>
      </View>
    );

  return (
    <View className="mt-4 mb-6">
      <Text className="text-xl font-semibold mb-2">Course Attendance</Text>
      {courses.map((course, index) => (
        <View
          key={index}
          className="bg-[#f9f9ff] p-4 rounded-2xl mb-3 shadow-sm flex-row justify-between items-center"
        >
          <View className="flex-1">
            <Text className="text-lg font-semibold text-[#611FE7]">
              {course.code}
            </Text>
            <Text className="text-sm text-gray-500">{course.title}</Text>
          </View>
          <View className="items-end">
            <Text className="text-xl font-bold text-[#611FE7]">
              {course.percentage ?? 0}%
            </Text>
            <Text
              className={`text-sm ${
                (course.percentage ?? 0) >= 75
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {(course.percentage ?? 0) >= 75 ? "Eligible" : "At Risk"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
