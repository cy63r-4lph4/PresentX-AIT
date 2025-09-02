import api from "@/lib/axios";

export const loginAdmin = (credentials: { user_id: string; password: string }) =>
  api.post("/login/admin", {
    ...credentials,
    user_type: "admin",
  });

export const loginLecturer = (credentials: { user_id: string; password: string }) =>
  api.post("/login/lecturer", {
    ...credentials,
    user_type: "lecturer",
  });

  export const logOut = () => {
  return api.post("/logout");
};
