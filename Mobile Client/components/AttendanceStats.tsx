import React from "react";
import { View, Text, FlatList } from "react-native";
import { MotiView } from "moti";

type Course = {
  code: string;
  title: string;
  percentage: number;
  eligible: boolean;
};

type AttendanceStatsProps = {
  courses: Course[];
};

export const AttendanceStats = ({ courses }: AttendanceStatsProps) => {
  return (
    <View className="mt-4 mb-6">
      <Text className="text-xl font-semibold mb-2 text-gray-900">
        Course Attendance
      </Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.code}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100, type: "timing" }}
            className="bg-[#f9f9ff] p-4 rounded-2xl mb-3 shadow-sm flex-row justify-between items-center"
          >
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[#611FE7]">
                {item.code}
              </Text>
              <Text className="text-sm text-gray-500">{item.title}</Text>
            </View>

            <View className="items-end">
              <Text className="text-xl font-bold text-[#611FE7]">
                {item.percentage}%
              </Text>
              <Text
                className={`text-sm ${
                  item.eligible ? "text-green-600" : "text-red-500"
                }`}
              >
                {item.eligible ? "Eligible" : "At Risk"}
              </Text>
            </View>
          </MotiView>
        )}
      />
    </View>
  );
};
