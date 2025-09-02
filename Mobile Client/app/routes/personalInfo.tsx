import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router, useNavigation } from "expo-router";

const PersonalInfo = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center py-2 gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color="#000" size={24} />
            </TouchableOpacity>
            <Text className="text-2xl font-medium">Personal Information</Text>
          </View>

          <View className="mt-10 justify-center items-center">
            <Image
              source={require("../../assets/images/barry.jpg")}
              style={{ width: 160, height: 160, borderRadius: 80 }}
              resizeMode="cover"
            />
          </View>

          <View className="gap-6">
            <View className="gap-1">
              <Text className="text-gray-500 text-xl">Personal Details</Text>
              <View className="bg-gray-200 rounded-t-xl font-bold">
                <Text className="text-xl font-semibold p-2">
                  Emmanuel Barry Amewuho
                </Text>
              </View>
              <View className="bg-gray-200  font-bold">
                <Text className="text-xl font-semibold p-2">
                  barrystarrck@gmail.com
                </Text>
              </View>
              <View className="bg-gray-200  font-bold">
                <Text className="text-xl font-semibold p-2">
                  +233(0)599 306 715
                </Text>
              </View>
              <View className="bg-gray-200 rounded-b-xl font-bold">
                <Text className="text-xl font-semibold p-2">Ghanaian</Text>
              </View>
            </View>
            <View className="gap-1">
              <Text className="text-gray-500 text-xl">Educational Details</Text>
              <View className="bg-gray-200 rounded-t-xl font-bold">
                <Text className="text-xl font-semibold p-2">
                  BSc Information Technology
                </Text>
              </View>
              <View className="bg-gray-200  font-bold">
                <Text className="text-xl font-semibold p-2">ADS23B00229Y </Text>
              </View>

              <View className="bg-gray-200 rounded-b-xl font-bold">
                <Text className="text-xl font-semibold p-2">Semester Six</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default PersonalInfo;
