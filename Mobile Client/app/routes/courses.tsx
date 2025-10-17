import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react-native";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";

const Courses = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  // Mock semesters with status for testing
  const semesters = [
    { id: 1, title: "Semester One", courses: 8, status: "completed" },
    { id: 2, title: "Semester Two", courses: 8, status: "completed" },
    { id: 3, title: "Semester Three", courses: 8, status: "completed" },
    { id: 4, title: "Semester Four", courses: 8, status: "pending" },
    { id: 5, title: "Semester Five", courses: 8, status: "pending" },
    { id: 6, title: "Semester Six", courses: 8, status: "pending" },
    { id: 7, title: "Semester Seven", courses: 8, status: "pending" },
    { id: 8, title: "Semester Eight", courses: 8, status: "pending" },
  ];

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // ✅ Filter based on active tab
  const filteredSemesters = semesters.filter((sem) => {
    if (activeTab === "all") return true;
    return sem.status === activeTab; // completed or pending
  });

  // ✅ Count for tabs
  const completedCount = semesters.filter((s) => s.status === "completed").length;
  const pendingCount = semesters.filter((s) => s.status === "pending").length;

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
      <StatusBar backgroundColor="#fff" barStyle="dark-content" hidden={false} />
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
          <Text className="text-white text-lg font-semibold">Semester Five</Text>
          <Text className="text-gray-200 text-sm mb-2">Active semester</Text>

          {/* Progress line */}
          <View className="flex-row items-center gap-2 mt-2">
            <View className="h-2 flex-1 bg-green-500 rounded-full" />
            <View className="h-2 w-10 bg-gray-300 rounded-full" />
          </View>

          <Text className="text-gray-200 text-xs mt-2">
            Registered courses (6/8)
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-gray-100 rounded-full p-1 mb-6">
          {[
            { key: "all", label: `All semesters (${semesters.length})` },
            { key: "completed", label: `Completed (${completedCount})` },
            { key: "pending", label: `Pending (${pendingCount})` },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`flex-1 py-2 rounded-full ${
                activeTab === tab.key ? "bg-secondary" : ""
              }`}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                className={`text-center ${
                  activeTab === tab.key
                    ? "text-white font-semibold"
                    : "text-gray-600"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Semester List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredSemesters.map((sem) => (
            <View key={sem.id} className="mb-4">
              <TouchableOpacity
                className="bg-white rounded-[20] p-4 border border-gray-200"
                onPress={() => setExpanded(expanded === sem.id ? null : sem.id)}
              >
                <Text className="text-lg font-medium">{sem.title}</Text>
                <Text className="text-sm text-gray-500">
                  All courses ({sem.courses})
                </Text>
              </TouchableOpacity>

              {expanded === sem.id && (
                <View className="mt-2 ml-4 border-l border-gray-200 pl-4">
                  {Array.from({ length: sem.courses }).map((_, idx) => (
                    <Text key={idx} className="text-gray-700 mb-1">
                      • Course {idx + 1}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Courses;
