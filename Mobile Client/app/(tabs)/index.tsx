import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Volume2 } from "lucide-react-native";
import { router } from "expo-router";

export default function Index() {
  const { width } = useWindowDimensions();

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
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-2xl font-medium">PresentX</Text>
            <Bell color="#000" size={24} />
          </View>

          {/* User Info */}
          <View className="flex-row items-center gap-4 mt-2">
            <Image
              source={require("../../assets/images/barry.jpg")}
              className="w-[60] h-[60] rounded-full"
            />
            <View className="gap-1">
              <Text className="text-2xl font-semibold">Emmanuel Barry ...</Text>
              <Text className="text-sm text-gray-500">
                ads23b00229y@ait.edu.gh
              </Text>
            </View>
          </View>

          {/* Announcement Card */}
          <View
            className="bg-secondary mt-12 rounded-[34] mb-8 flex-row gap-2"
            style={[Style.shadow, { minHeight: 135, padding: 10 }]}
          >
            <View className="items-center justify-end space-y-1 px-2">
              <View
                className="relative ml-2"
                style={{ width: 52, height: 56.31, top: -36, left: 18 }}
              >
                <Image
                  source={require("../../assets/images/message.png")}
                  className="w-full h-full"
                  resizeMode="contain"
                />
                <Volume2
                  color="#fff"
                  size={22}
                  style={{ position: "absolute", top: "25%", left: "30%" }}
                />
              </View>
              <View>
                <View className="w-8 h-8 rounded-full bg-dot ml-4" />
                <View className="w-5 h-5 rounded-full bg-dot ml-0" />
                <View className="w-4 h-4 rounded-full bg-dot ml-8" />
              </View>
            </View>

            <View className="flex-1 justify-center gap-2 pr-2">
              <Text
                className="text-primary text-xl font-semibold"
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                Attendance in the next 30mins
              </Text>
              <Text
                className="text-primary text-sm"
                style={{ flexWrap: "wrap" }}
              >
                Attendance officers will be coming round in the next 30mins to take attendance
              </Text>
            </View>
          </View>

          {/* Action Cards */}
          <View className="flex-row flex-wrap justify-between">
            {([
              {
                title: "Student Attendance",
                subtitle: "Track all your attendance",
                img: require("../../assets/images/attendance_marking.png"),
                path: "/routes/attendance",
                color: "card-c1",
                border: "card-c1b",
              },
              {
                title: "Courses",
                subtitle: "View registered courses",
                img: require("../../assets/images/courses.png"),
                path: "/routes/courses",
                color: "card-c2",
                border: "card-c2b",
              },
              {
                title: "Student ID",
                subtitle: "View your student ID",
                img: require("../../assets/images/idcard.png"),
                path: "/routes/idcard",
                color: "card-c3",
                border: "card-c3b",
              },
              {
                title: "Personal Information",
                subtitle: "View personal information",
                img: require("../../assets/images/personal_info.png"),
                path: "/routes/personalInfo",
                color: "card-c4",
                border: "card-c4b",
              },
            ] as const).map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className={`bg-${item.color} border-${item.border} rounded-[20.27] w-[48%] mb-4 p-4 border`}
                onPress={() => router.navigate(item.path)}
              >
                <Image
                  source={item.img}
                  resizeMode="cover"
                  className="w-16 h-16 mb-2"
                />
                <Text className="font-medium">{item.title}</Text>
                <Text className="text-sm text-gray-500">{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
