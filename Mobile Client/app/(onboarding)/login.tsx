import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginStudent } from "@/api/auth";
import Toast from "react-native-toast-message";
import { router, useNavigation } from "expo-router";
import { getHashedFingerprint } from "@/components/hashFingerPrint";
import { useAuth } from "@/providers/auth-context";

const Login = () => {
  const { login } = useAuth();
  const navigation = useNavigation();

  const [form, setForm] = useState({ user_id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fingerprint, setFingerprint] = useState("");

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await getHashedFingerprint();
      setFingerprint(fp);
    };

    loadFingerprint();
  }, []);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.user_id || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginStudent({
        ...form,
        fingerprint: fingerprint,
      });
      const { access_token, user } = response.data;

      await login(access_token, user);

      Toast.show({
        type: "success",
        text1: "Login successful!",
      });

      router.replace("/(tabs)");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed. Try again.";
      setError(message);

      Toast.show({
        type: "error",
        text1: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView className="bg-secondary rounded-b-[120px]">
          <View className="bg-secondary pt-16 rounded-b-[120px]">
            <Image
              source={require("../../assets/images/students.png")}
              className="self-center"
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>

        {/* Form card */}
        <View className="bg-gray-200 rounded-3xl self-center w-4/5 -mt-28 py-10 px-6">
          <Text className="text-secondary text-4xl font-extrabold">
            Sign In
          </Text>

          {error ? (
            <Text className="text-red-500 text-sm mt-4">{error}</Text>
          ) : null}

          <View className="mt-6">
            <Text className="text-secondary text-lg">Student ID</Text>
            <TextInput
              className="bg-primary rounded-lg px-4 py-3 mt-2 text-black"
              placeholder="Enter your ID"
              placeholderTextColor="#ccc"
              value={form.user_id}
              onChangeText={(text) => handleChange("user_id", text)}
            />

            <Text className="text-secondary text-lg mt-6">Password</Text>
            <TextInput
              className="bg-primary rounded-lg px-4 py-3 mt-2 text-black"
              placeholder="Enter your password"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />

            <TouchableOpacity
              className="mt-10 h-14 w-full"
              onPress={handleSubmit}
              disabled={loading}
            >
              <View
                className={`bg-secondary ${
                  loading ? "opacity-50" : ""
                } w-full h-full rounded-xl items-center justify-center`}
              >
                <Text className="text-primary text-lg font-bold px-8">
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
