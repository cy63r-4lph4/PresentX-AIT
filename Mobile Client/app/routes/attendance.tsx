import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, router } from "expo-router";
import { Calendar } from "react-native-calendars";
import WithLoveSVG from "../../assets/icons/withLove.svg";
import QRScannerModal from "@/components/ScannerModal";
import EventCard from "@/components/EventCard";
import { useTodaysEvents } from "@/hooks/TodayCourse";
import { AttendanceStats } from "@/components/AttendanceStats";

const Attendance = () => {
  const navigation = useNavigation();
  const { events, loading, error, refetch } = useTodaysEvents();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleCardPress = (event) => {
    if (event.marked) return;
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
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-white px-3">
        {/* ---------------- Header ---------------- */}
        <View className="flex-row items-center py-3 gap-4 mb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">
            {formattedDate}
          </Text>
        </View>

        {/* ---------------- Calendar ---------------- */}
        <View className="mb-5">
          <Calendar
            disableArrowLeft
            disableArrowRight
            hideExtraDays
            renderHeader={() => <></>}
            renderArrow={() => <></>}
            theme={{
              backgroundColor: "white",
              calendarBackground: "white",
              todayTextColor: "#fff",
              todayBackgroundColor: "#611FE7",
              dayTextColor: "#000",
              textDisabledColor: "#ccc",
              textDayFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        </View>

        {/* ---------------- Scrollable Section ---------------- */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* ---------- Stats ---------- */}
          <AttendanceStats />

          {/* ---------- Today's Events ---------- */}
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Today's Events
          </Text>

          {loading ? (
            <View className="flex items-center justify-center py-14 px-6 rounded-2xl bg-[#F3F4F6] shadow-sm">
              <ActivityIndicator color="#611FE7" size="large" />
              <Text className="text-base text-gray-500 text-center mt-3">
                Fetching your schedule for today...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-10 space-y-4">
              <Text className="text-red-500 text-center text-base">
                ❌ {error}
              </Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="bg-purple-600 px-6 py-2 rounded-full shadow-md"
              >
                <Text className="text-white font-semibold">🔁 Retry</Text>
              </TouchableOpacity>
            </View>
          ) : events.length === 0 ? (
            <View className="flex items-center justify-center py-20">
              <WithLoveSVG width={100} height={100} />
              <Text className="text-2xl font-semibold text-gray-600 text-center mt-2">
                No events today
              </Text>
              <Text className="text-sm text-gray-400 text-center mt-1 px-8">
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

        {/* ---------------- QR Scanner Modal ---------------- */}
        {scannerVisible && (
          <QRScannerModal
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            event={selectedEvent}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default Attendance;
