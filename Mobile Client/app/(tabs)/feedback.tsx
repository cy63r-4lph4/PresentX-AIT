import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Clock } from "lucide-react-native";

const FeedbackScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 60 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-2xl font-medium">Feedback</Text>
                <Bell color="#000" size={24} />
              </View>

              {/* Top Message */}
              <View className="justify-center items-center mt-16 gap-2 px-4">
                <Text className="text-3xl font-bold text-center">
                  How can we help you?
                </Text>
                <Text className="text-lg text-gray-500 text-center">
                  Tell us how we can help you, our experts are standing by to
                  assist you with anything
                </Text>
              </View>

              {/* Support Card */}
              <View className="mt-20 gap-4">
                <View className="bg-[rgba(134,82,253,0.05)] rounded-xl p-5 flex-row gap-4 items-center">
                  <Image
                    source={require("../../assets/images/support.png")}
                    style={{ width: 60, height: 60, resizeMode: "contain" }}
                  />
                  <View className="flex-1 gap-2">
                    <Text className="text-xl font-semibold">
                      Start a conversation with us
                    </Text>
                    <View className="flex-row items-center gap-1 flex-wrap">
                      <Text className="text-gray-500 text-lg">Reply Time |</Text>
                      <View className="flex-row gap-1 items-center">
                        <Clock color={"#000"} size={16} strokeWidth={2} />
                        <Text className="text-lg font-medium">24 hours</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Message Input */}
                <TextInput
                  placeholder="Send us a message"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="bg-white text-lg p-4 rounded-2xl border border-gray-300 text-gray-800 h-[117px]"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className="mt-10 self-center w-[329px] h-14"
                onPress={() => {}}
              >
                <View className="bg-secondary h-full rounded-xl items-center justify-center">
                  <Text className="text-primary text-lg font-semibold">Submit</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
};

export default FeedbackScreen;
