import { Stack } from "expo-router";
import "./global.css";
import { ActivityIndicator, View } from "react-native";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import "react-native-get-random-values";
import { logout } from "@/lib/logout";
import { logoutEmitter } from "@/lib/axios";
import { AuthProvider, useAuth } from "@/providers/auth-context";
import { ReactQueryProvider } from "@/providers/queryProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ReactQueryProvider>
        <GestureHandlerRootView className="flex-1">
          <RootNavigator />
        </GestureHandlerRootView>
      </ReactQueryProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  if (loading || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

function useFonts(fontMap: { [key: string]: any }): [boolean] {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    Font.loadAsync(fontMap).then(() => setLoaded(true));
  }, []);
  return [loaded];
}
