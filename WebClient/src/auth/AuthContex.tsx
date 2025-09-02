import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import type {
  ExtendedAuthContextType,
  ExtendedUser,
  Role,
  User,
} from "@/components/Interfaces";

const AuthContext = createContext<ExtendedAuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [lectToken, setLectToken] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdminToken = localStorage.getItem("admin_auth_token");
    const storedAdminUser = localStorage.getItem("admin_auth_user");
    const storedLectToken = localStorage.getItem("lect_auth_token");
    const storedLectUser = localStorage.getItem("lect_auth_user");

    let combinedUser: ExtendedUser | null = null;
    const roles: Role[] = [];

    if (storedLectToken && storedLectUser) {
      const parsedLectUser: User = JSON.parse(storedLectUser);
      setLectToken(storedLectToken);
      roles.push("lecturer");
      combinedUser = { ...parsedLectUser, roles };
    }

    if (storedAdminToken && storedAdminUser) {
      const parsedAdminUser: User = JSON.parse(storedAdminUser);
      setAdminToken(storedAdminToken);
      roles.push("admin");
      combinedUser = combinedUser
        ? { ...combinedUser, roles }
        : { ...parsedAdminUser, roles };
    }

    if (combinedUser) {
      setUser(combinedUser);

      // ⬇️ Move this HERE after roles are loaded
      const lastRole = localStorage.getItem("active_role") as Role | null;
      const defaultRole =
        lastRole && roles.includes(lastRole)
          ? lastRole
          : roles.includes("admin")
          ? "admin"
          : "lecturer";

      const activeToken =
        defaultRole === "admin" ? storedAdminToken : storedLectToken;

      setToken(activeToken || null);
      setActiveRole(defaultRole);

      if (activeToken) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${activeToken}`;
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string, user: User, user_type: Role) => {
    const fullUser: ExtendedUser = { ...user, roles: [user_type] };
    setUser(fullUser);
    setToken(token);
    setActiveRole(user_type);

    if (user_type === "lecturer") {
      setLectToken(token);
      localStorage.setItem("lect_auth_token", token);
      localStorage.setItem("lect_auth_user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      setAdminToken(token);
      localStorage.setItem("admin_auth_token", token);
      localStorage.setItem("admin_auth_user", JSON.stringify(user));
      localStorage.setItem("token", token);
    }
    localStorage.setItem("active_role", user_type);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAdminToken(null);
    setLectToken(null);
    setActiveRole(null);

    localStorage.removeItem("admin_auth_token");
    localStorage.removeItem("admin_auth_user");
    localStorage.removeItem("lect_auth_token");
    localStorage.removeItem("lect_auth_user");
    localStorage.removeItem("token");

    delete axios.defaults.headers.common["Authorization"];
  };

  const switchRole = (role: Role) => {
    if (role === "lecturer" && lectToken) {
      setActiveRole("lecturer");
      setToken(lectToken);
      localStorage.setItem("token", lectToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${lectToken}`;
    } else if (role === "admin" && adminToken) {
      setActiveRole("admin");
      setToken(adminToken);
      localStorage.setItem("token", adminToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
    }
    localStorage.setItem("active_role", role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        admin_token: adminToken,
        lect_token: lectToken,
        activeRole,
        setActiveRole,
        login,
        logout,
        loading,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
