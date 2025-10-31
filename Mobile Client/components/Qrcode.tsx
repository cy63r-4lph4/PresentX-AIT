import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStudentDetails } from "@/hooks/useStudentDetails";

const STORAGE_KEY = "student_details_cache";

interface StudentQRProps {
  refreshTrigger?: boolean; // Controlled externally (Update Card button)
}

const StudentQR: React.FC<StudentQRProps> = ({ refreshTrigger }) => {
  const { refetch } = useStudentDetails(); // We'll only fetch on-demand
  const [cachedStudent, setCachedStudent] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 1️⃣ Load from cache on mount
  useEffect(() => {
    const loadCache = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setCachedStudent(JSON.parse(saved));
      } catch (err) {
        console.warn("Failed to load cached student:", err);
      } finally {
        setReady(true);
      }
    };
    loadCache();
  }, []);

  // 2️⃣ When refreshTrigger changes, fetch latest & update cache
  useEffect(() => {
    const refreshData = async () => {
      if (!refreshTrigger) return; // do nothing unless triggered

      setUpdating(true);
      try {
        const res = await refetch(); // manually refetch from API
        const data = res.data;
        if (data) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          setCachedStudent(data);
          console.log("✅ Student data updated in cache");
        }
      } catch (err) {
        console.warn("❌ Failed to refresh student data:", err);
      } finally {
        setUpdating(false);
      }
    };

    refreshData();
  }, [refreshTrigger]);

  // 3️⃣ Display loading state
  if (!ready && !cachedStudent) {
    return (
      <View className="items-center justify-center">
        <ActivityIndicator size="large" color="#611FE7" />
      </View>
    );
  }

  // 4️⃣ Handle missing data
  if (!cachedStudent) {
    return (
      <View className="items-center justify-center">
        <Text className="text-gray-500 text-center">
          No student data available.
        </Text>
      </View>
    );
  }

  // 5️⃣ Prepare QR data
  const qrData = JSON.stringify({
    name: cachedStudent.name,
    student_id: cachedStudent.student_id,
    email: cachedStudent.email,
    phone: cachedStudent.phone,
    stream: cachedStudent.stream,
    registered_courses: cachedStudent.registered_courses,
  });

  return (
    <View className="items-center justify-center">
      <QRCode
        value={qrData}
        size={80}
        color="#000"
        backgroundColor="#fff"
      />
      {updating && (
        <Text className="text-xs text-gray-500 mt-2">Updating...</Text>
      )}
    </View>
  );
};

export default StudentQR;
