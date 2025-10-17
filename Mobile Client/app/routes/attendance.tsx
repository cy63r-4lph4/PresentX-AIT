import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CalendarDaysIcon } from "lucide-react-native";
import { Image } from "react-native";
import { router, useNavigation } from "expo-router";
import { Calendar } from "react-native-calendars";
import { useTodaysEvents } from "@/hooks/TodayCourse";
import WithLoveSVG from "../../assets/icons/withLove.svg";
import QRScannerModal from "@/components/ScannerModal";
import EventCard from "@/components/EventCard";

const Attendance = () => {
  const navigation = useNavigation();
  const { events, loading, error, refetch } = useTodaysEvents();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleCardPress = (event) => {
    if (event.marked) {
      return;
    }
    setSelectedEvent(event);
    setScannerVisible(true);
  };
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("en-US", { month: "long" });
  const weekday = today.toLocaleString("en-US", { weekday: "long" });
  const year = today.getFullYear();

  const formattedDate = `${weekday} ${day}${getOrdinal(day)} ${month}, ${year}`;

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
          <Text className="text-xl font-medium">{formattedDate}</Text>
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
                <TouchableOpacity
                  key={event.id}
                  onPress={() => handleCardPress(event)}
                >
                  <EventCard event={event} index={index} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
        {scannerVisible && (
          // <GestureHandlerRootView className="flex-1">
          <QRScannerModal
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            event={selectedEvent}
          />
          // </GestureHandlerRootView>
        )}
      </SafeAreaView>
    </>
  );
};

export default Attendance;
