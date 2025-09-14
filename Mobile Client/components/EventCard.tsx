import { View, Text, Image } from "react-native";
import React from "react";
import { CalendarDaysIcon } from "lucide-react-native";

export default function EventCard({ event, index }) {
  const bgClass =
    index % 3 === 0
      ? "bg-card-c1 border-card-c1b"
      : index % 3 === 1
      ? "bg-card-c2 border-card-c2b"
      : "bg-card-c3 border-card-c3b";

  const iconBgClass =
    index % 3 === 0
      ? "bg-card-c1b shadow-card-c1a"
      : index % 3 === 1
      ? "bg-card-c2b shadow-card-c2a"
      : "bg-card-c3b shadow-card-c3a";

  return (
    <View
      key={event.id}
      className={`flex-row justify-between p-5 rounded-2xl border mb-4 ${bgClass}`}
    >
      {/* Left side */}
      <View className="flex-1 pr-4 gap-4">
        <View className="max-w-full">
          <Text
            className="text-xl font-bold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {event.code}
          </Text>
          <Text
            className="text-gray-500"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {event.title}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Image
            source={require("../assets/images/person.png")}
            resizeMode="cover"
            className="w-8 h-8 rounded-full"
          />
          <Text
            className="text-black text-lg font-medium flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {event.lecturer}
          </Text>
        </View>
      </View>

      {/* Right side */}
      <View className="items-end justify-between">
        <View
          className={`w-[44px] h-[44px] justify-center items-center rounded-full ${iconBgClass}`}
        >
          <CalendarDaysIcon size={24} color={"#fff"} />
        </View>

        <View className="items-end mt-2">
          <Text
            className="text-gray-500 text-right text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {event.start_time} - {event.end_time}
          </Text>

          {event.marked ? (
            <Text style={{ color: "#16a34a" }} className="text-green-600 font-semibold text-xs mt-1">
              ✔ Marked
            </Text>
          ) : (
            <Text className="text-red-500 font-semibold text-xs mt-1">
              Not Marked
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
