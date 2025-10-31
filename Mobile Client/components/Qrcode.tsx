import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStudentDetails } from "@/hooks/useStudentDetails";

const STORAGE_KEY = "student_details_cache";

const StudentQR = () => {
  const { student, loading, error } = useStudentDetails();
  const [cachedStudent, setCachedStudent] = useState<any>(null);
  const [ready, setReady] = useState(false);

  // 1️⃣ Try to load cached data initially
  useEffect(() => {
    const loadCache = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setCachedStudent(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Failed to load cached student:", err);
      } finally {
        setReady(true);
      }
    };
    loadCache();
  }, []);

  // 2️⃣ When fresh data arrives, update cache
  useEffect(() => {
    const updateCache = async () => {
      if (student) {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(student));
          setCachedStudent(student);
        } catch (err) {
          console.warn("Failed to save student cache:", err);
        }
      }
    };
    updateCache();
  }, [student]);

  // 3️⃣ Determine what data to show
  const displayStudent = student || cachedStudent;

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#611FE7" />
      </View>
    );
  }

  if (!displayStudent) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No student data available.</Text>
      </View>
    );
  }

  // 4️⃣ Prepare QR data
  const qrData = JSON.stringify({
    name: displayStudent.name,
    student_id: displayStudent.student_id,
    email: displayStudent.email,
    phone: displayStudent.phone,
    registered_courses: displayStudent.registered_courses,
  });

  return (
    <View className="">
      <QRCode value={qrData} size={80} color="#000" backgroundColor="#fff" />
    </View>
  );
};

export default StudentQR;
