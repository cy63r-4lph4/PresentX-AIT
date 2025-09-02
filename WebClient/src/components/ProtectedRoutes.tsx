import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContex";

type Props = {
  children: React.ReactElement;
  allowedRoles: Array<"admin" | "lecturer">;
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading, activeRole, switchRole } = useAuth();
  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(activeRole!)) {
      const targetRole = allowedRoles.find((r) => user.roles.includes(r));

      if (targetRole) {
        switchRole(targetRole);
      }
    }
  }, [loading, user, activeRole, allowedRoles, switchRole]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500 animate-pulse">
        Checking access...
      </div>
    );
  }

  if (!user || !user.roles.some((r) => allowedRoles.includes(r))) {
    const fallback = allowedRoles.includes("lecturer") ? "a" : "s";
    return <Navigate to={`/login/${fallback}`} replace />;
  }

  return children;
}
