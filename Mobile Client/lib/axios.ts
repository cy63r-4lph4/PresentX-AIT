import axios from "axios";
import { API_BASE_URL } from "@env";
import * as SecureStore from "expo-secure-store";
import EventEmitter from "eventemitter3";

export const logoutEmitter = new EventEmitter();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach token to each request
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("student_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error reading token from SecureStore", error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.log("API error:", error);
    const token = await SecureStore.getItemAsync("student_token");

    if (error.response?.status === 401 && token) {
      logoutEmitter.emit("forceLogout");
    }

    return Promise.reject(error); 
  }
);

export default api;
