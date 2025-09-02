import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Onboard = () => {
  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <StatusBar hidden />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-between px-6 py-10">
          {/* Top Texts */}
          <View className="mt-10">
            <Text className="text-primary text-2xl font-bold">Welcome To</Text>
            <Text className="text-primary text-5xl font-extrabold">PresentX</Text>
          </View>

          {/* Image */}
          <Image
            source={require("../../assets/images/students.png")}
            className="w-full mt-12"
            resizeMode="contain"
          />

          {/* Taglines */}
          <View className="mt-8 items-center">
            <Text className="text-primary text-lg italic text-center">
              No more attendance hassle!
            </Text>
            <Text className="text-primary text-lg italic text-center mt-2">
              Just scan
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            className="mt-10 self-center w-full h-14"
            onPress={() => router.push("/login")}
          >
            <View className="bg-primary w-full h-full rounded-xl items-center justify-center">
              <Text className="text-secondary text-lg font-bold">
                Get Started
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboard;
