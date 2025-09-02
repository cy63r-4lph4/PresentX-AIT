import { View, Text, Settings } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Home, Settings2 } from "lucide-react-native";
import { TabBar } from "@/components/TabBar";

const _layout = () => {
  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "rgba(97, 31, 231, 1)",
          borderRadius: 50,
          marginHorizontal: 36,
          marginBottom: 30,
          height: 52,
          overflow: "hidden",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: "Feedback",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;
