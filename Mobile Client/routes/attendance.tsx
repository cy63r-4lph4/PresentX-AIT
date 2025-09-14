import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CalendarDaysIcon } from "lucide-react-native";
import { Image } from "react-native";
import { router, useNavigation } from "expo-router";
import { Calendar } from "react-native-calendars";
import WithLoveSVG from "../../assets/icons/withLove.svg";
import { useTodaysEvents } from "@/hooks/TodayCourse";

const Attendance = () => {
  const navigation = useNavigation();
  const { events, loading, error, refetch } = useTodaysEvents();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const getCardClass = (color) => {
  switch (color) {
    case "card-c1":
      return "bg-card-c1 border-card-c1b";
    case "card-c2":
      return "bg-card-c2 border-card-c2b";
    case "card-c3":
      return "bg-card-c3 border-card-c3b";
    case "card-c4":
      return "bg-card-c4 border-card-c4b";
    default:
      return "";
  }
};


  return (
    <>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        hidden={false}
      />
      <SafeAreaView className="flex-1 px-3 w-full bg-white">
        <View className="flex-row items-center py-2  gap-4">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text className="text-xl font-medium">Friday 2nd May, 2025</Text>
        </View>
        <View className="mb-8">
          <Calendar
            disableArrowLeft={true}
            disableArrowRight={true}
            hideExtraDays
            renderHeader={() => <></>}
            renderArrow={() => <></>}
            theme={{
              backgroundColor: "white",
              calendarBackground: "white",
              textSectionTitleColor: "#white",
              selectedDayBackgroundColor: "",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "white",
              todayBackgroundColor: "#611FE7",
              dayTextColor: "black",
              textDisabledColor: "#ccc",
              monthTextColor: "#5344C#611FE78",
              textMonthFontWeight: "bold",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-semibold">Today's Events</Text>
          <ScrollView
            className="flex-1 mt-4"
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View className="flex items-center justify-center py-16 px-6 rounded-2xl bg-[#F3F4F6] mt-6 shadow-sm">
                <Text className="text-xl font-semibold text-gray-600 mb-2">
                  ⏳ Hold on...
                </Text>
                <Text className="text-base text-gray-500 text-center">
                  We're fetching your schedule for today.
                </Text>
              </View>
            ) : error ? (
              <View className="items-center justify-center py-10 px-4 space-y-4">
                <Text className="text-red-500 text-center text-base">
                  ❌ {error}
                </Text>
                <TouchableOpacity
                  onPress={() => refetch()}
                  className="bg-purple-600 px-6 py-2 rounded-full shadow-lg"
                >
                  <Text className="text-white font-semibold">🔁 Retry</Text>
                </TouchableOpacity>
              </View>
            ) : events.length === 0 ? (
              <View className="flex-1 justify-center items-center py-20">
                <WithLoveSVG width={100} height={100} />

                <Text className="text-2xl font-semibold text-gray-600 text-center">
                  No events today
                </Text>
                <Text className="text-md text-gray-400 mt-2 text-center px-10">
                  Check back later or contact your department for updates.
                </Text>
              </View>
            ) : (
              events.map((event, index) => (
                <View
                  key={event.id}
                  className={`flex-row justify-between p-5 rounded-2xl border mb-4 ${
                    index % 3 === 0
                      ? "bg-card-c1 border-card-c1b"
                      : index % 3 === 1
                      ? "bg-card-c2 border-card-c2b"
                      : "bg-card-c3 border-card-c3b"
                  }`}
                >
                  <View className="gap-4">
                    <View>
                      <Text className="text-xl font-bold">{event.code}</Text>
                      <Text className="text-gray-500">{event.title}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Image
                        source={require("../../assets/images/person.png")}
                        resizeMode="cover"
                        className="w-8 h-8"
                      />
                      <Text className="text-black text-lg font-medium">
                        {event.lecturer}
                      </Text>
                    </View>
                  </View>
                  <View className="gap-4 items-end">
                    <View
                      className={`w-[44px] h-[44px] justify-center items-center rounded-full ${
                        index % 3 === 0
                          ? "bg-card-c1b shadow-card-c1a"
                          : index % 3 === 1
                          ? "bg-card-c2b shadow-card-c2a"
                          : "bg-card-c3b shadow-card-c3a"
                      }`}
                    >
                      <CalendarDaysIcon size={24} color={"#fff"} />
                    </View>
                    <Text className="text-gray-500">
                      {event.start_time} - {event.end_time}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Attendance;
