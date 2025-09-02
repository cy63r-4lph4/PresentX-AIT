import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { Image } from "react-native";
import { router, useNavigation } from "expo-router";
import ProgressBar from "@/components/ProgressBar";

const Courses = () => {
  const navigation = useNavigation();

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
        <View className="flex-row items-center py-2 bg-pr gap-4">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-medium">Courses</Text>
        </View>

        <View
          className="bg-secondary h-[135] mt-12 rounded-[34] mb-8 flex-row gap-2"
          style={Style.shadow}
        >
          <View className="py-2 items-center space-y-1 justify-end px-2">
            <View className="">
              <View className="w-8 h-8 rounded-full bg-dot ml-4" />
              <View className="w-5 h-5 rounded-full bg-dot ml-0" />
              <View className="w-4 h-4 rounded-full bg-dot ml-8" />
            </View>
          </View>

          <View className="gap-4 justify-center">
            <Text className="text-primary text-2xl font-semibold">
              Program Status: 60%
            </Text>
            <ProgressBar total={52} completed={40} duration={800}/>
            <Text className="text-gray-300 text-lg italic text-wrap w-[274]">
              Active courses (5/7)
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Courses;
