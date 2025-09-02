import api from "@/lib/axios";

export const loginStudent = (credentials: { user_id: string; password: string; fingerprint: string }) => {
  return api.post("/login/student", {
    ...credentials,
    user_type: "student",
  });
};

  export const logOut = () => {
  return api.post("/logout");
};
