import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";

// Remove the useAuth hook from here
export const logout = async (logoutCallback: () => void) => {

  logoutCallback();

  router.replace("/(onboarding)");
};
