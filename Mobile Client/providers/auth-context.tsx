// auth-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { logoutEmitter } from "@/lib/axios";
import { Alert } from "react-native";
import { router } from "expo-router";

type User = {
  id: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("student_token");
        const storedUser = await SecureStore.getItemAsync("student_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error restoring session:", err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    const handleForceLogout = async () => {
      Alert.alert(
        "Logged out",
        "You have been logged out due to invalid token."
      );

      await logout();
    };

    logoutEmitter.on("forceLogout", handleForceLogout);

    return () => {
      logoutEmitter.off("forceLogout", handleForceLogout);
    };
  }, []);

  const login = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    await SecureStore.setItemAsync("student_token", newToken);
    await SecureStore.setItemAsync("student_user", JSON.stringify(newUser));
  };

  const logout = async (shouldRedirect = true) => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("student_token");
    await SecureStore.deleteItemAsync("student_user");

    if (shouldRedirect) {
      router.replace("/(onboarding)");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
