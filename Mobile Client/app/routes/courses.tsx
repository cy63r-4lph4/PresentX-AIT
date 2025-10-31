import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react-native";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import { useStudentCourses } from "@/hooks/useStudentCourses";

const Courses = () => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState<number | null>(null);
  const { courses, loading, error, refetch } = useStudentCourses();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const Style = StyleSheet.create({
    shadow: {
      shadowColor: "rgba(97, 31, 231, 1)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },
  });

  return (
    <>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        hidden={false}
      />
      <SafeAreaView className="flex-1 px-3 w-full bg-white">
        {/* Header */}
        <View className="flex-row items-center py-2 gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <View className="flex-1 flex-row justify-between items-center">
            <Text className="text-2xl font-medium">Courses</Text>
            <View className="flex-row items-center gap-4">
              <Bell color="#000" size={22} />
              <Search color="#000" size={22} />
            </View>
          </View>
        </View>

        {/* Active semester card */}
        <View
          className="bg-secondary mt-6 rounded-[34] mb-8"
          style={[Style.shadow, { minHeight: 120, padding: 16 }]}
        >
          <Text className="text-white text-lg font-semibold">
            Active Semester
          </Text>
          <Text className="text-gray-200 text-sm mb-2">
            Registered courses ({courses.length})
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="h-2 flex-1 bg-green-500 rounded-full" />
            <View className="h-2 w-10 bg-gray-300 rounded-full" />
          </View>
          <Text className="text-gray-200 text-xs mt-2">
            View all registered courses below
          </Text>
        </View>

        {/* Body */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <View className="items-center justify-center mt-20">
              <ActivityIndicator size="large" color="#611FE7" />
              <Text className="text-gray-500 mt-2">Loading courses...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center mt-20">
              <Text className="text-red-500">{error}</Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="mt-3 bg-secondary px-4 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : courses.length === 0 ? (
            <View className="items-center justify-center mt-20">
              <Text className="text-gray-500">
                You have not registered any courses yet.
              </Text>
            </View>
          ) : (
            courses.map((course, idx) => (
              <View key={course.id ?? idx} className="mb-4">
                <TouchableOpacity
                  className="bg-white rounded-[20] p-4 border border-gray-200"
                  onPress={() =>
                    setExpanded(expanded === course.id ? null : course.id)
                  }
                >
                  <Text className="text-lg font-medium">{course.code}</Text>
                  <Text className="text-sm text-gray-500">
                    {course.description || "No description"}
                  </Text>
                </TouchableOpacity>

                {expanded === course.id && (
                  <View className="mt-2 ml-4 border-l border-gray-200 pl-4">
                    <Text className="text-gray-700 mb-1">
                      Type: {course.type}
                    </Text>
                    <Text className="text-gray-700 mb-1">
                      Date: {course.date}
                    </Text>
                    <Text className="text-gray-700 mb-1">
                      Time: {course.start_time} - {course.end_time}
                    </Text>
                    {course.streams?.length > 0 && (
                      <Text className="text-gray-700 mb-1">
                        Streams: {course.streams.join(", ")}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Courses;
