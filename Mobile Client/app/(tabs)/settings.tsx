import { View, Text, StatusBar, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, BellRing, LockKeyhole, Phone } from "lucide-react-native";

const settings = () => {
  return (
    <>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        hidden={false}
      />
      <SafeAreaView className="flex-1 px-3 w-full">
        <View className="flex-row justify-between items-center py-2 bg-pr">
          <Text className="text-2xl font-medium">Settings</Text>
          <Bell color="#000" size={24} />
        </View>
        <View className="mt-8">
          <Text className="text-xl font-semibold">Account Settings</Text>
          <View className="flex-row items-center gap-4 mt-3">
            <Image
              source={require("../../assets/images/barry.jpg")}
              className="w-[60] h-[60] rounded-full"
            />
            <View className="gap-1">
              <Text className="text-xl font-semibold">
                Emmanuel Barry Amewuho
              </Text>
              <Text className="text-lg text-gray-500">Edit your profile</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-4 mt-8 pl-4">
            <LockKeyhole color={'#000'} size={24}/>
            <View className="gap-1">
              <Text className="text-xl font-semibold">
                Change Password
              </Text>
              <Text className="text-lg text-gray-500">Visit LEMASS to change your password</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-4 mt-8 pl-4">
            <Phone color={'#000'} size={24}/>
            <View className="gap-1">
              <Text className="text-xl font-semibold">
                Change Phone Number
              </Text>
              <Text className="text-lg text-gray-500">Visit LEMASS to change your phone number</Text>
            </View>
          </View>
        </View>
        <View className="mt-10">
          <Text className="text-xl font-semibold">General</Text>
          <View className="flex-row items-center gap-4 mt-8 pl-4">
            <BellRing color={'#000'} size={24}/>
            <View className="gap-1">
              <Text className="text-xl font-semibold">
                Notification
              </Text>
              <Text className="text-lg text-gray-500">Toggle notification</Text>
            </View>
          </View>
          
        </View>
        <View></View>
      </SafeAreaView>
    </>
  );
};

export default settings;
