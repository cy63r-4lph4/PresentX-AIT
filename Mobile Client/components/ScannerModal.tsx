import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Switch,
  Pressable,
  ActivityIndicator,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Event } from "./Interfaces";
import CameraScanner from "./CameraScanner";
import { useMarkAttendance } from "@/hooks/MarkAttendance";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { XCircle } from "lucide-react-native";
interface QrModalProps {
  visible: boolean;
  onClose: () => void;
  event: Event;
}

export default function QRScannerModal({
  visible,
  onClose,
  event,
}: QrModalProps) {
  const [mode, setMode] = useState<"scan" | "be-scanned">("scan");
  const [scanState, setScanState] = useState<
    "idle" | "scanning" | "error" | "success"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const {
    mutate: mark,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  } = useMarkAttendance();

  useEffect(() => {
    if (isError) {
      setScanState("error");
      setErrorMsg(
        (error && (error as any)?.response?.data?.message) ||
          error?.message ||
          "Failed to mark attendance"
      );

      const timer = setTimeout(() => {
        setScanState("idle");
        reset();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isError, error, reset]);

  const handleScanned = (result) => {
    setScanState("scanning");
    mark(result.token, {
      onSuccess: () => {
        setTimeout(() => {
          sheetRef.current?.close();
          onClose();
        }, 2000);
      },
    });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "scan" ? "be-scanned" : "scan"));
  };

  return (
    <BottomSheet
      ref={sheetRef}
      detached
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ borderRadius: 24 }}
      enableContentPanningGesture={false}
      handleIndicatorStyle={{ backgroundColor: "#611FE7" }}
    >
      <BottomSheetView className="flex-1">
        <View className="flex-1 px-4 h-full">
          {/* Header */}
          <View className="flex-row justify-between items-center w-full ">
            <View className="flex-1 pr-2">
              <Text
                className="text-black font-bold text-lg"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {event?.code}
              </Text>
              <Text
                className="text-gray-500 text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {event?.title || null}
              </Text>
            </View>
            <View className="flex-row items-center space-x-2 flex-shrink-0">
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                className="w-8 h-8 rounded-full"
              />
              <Text
                className="text-black text-sm font-medium"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {event?.lecturer}
              </Text>
            </View>
          </View>

          {/* Toggle */}
          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-gray-500">Scan QR / Be Scanned</Text>
            <Switch value={mode === "be-scanned"} onValueChange={toggleMode} />
          </View>

          {/* QR / Scanner */}
          <View className="items-center justify-center py-6 mb-4">
            {mode === "scan" ? (
              scanState === "idle" ? (
                <CameraScanner onScanned={handleScanned} />
              ) : scanState === "scanning" ? (
                <View className="items-center justify-center h-64 w-full">
                  <ActivityIndicator size="large" color="#611FE7" />
                  <Text className="mt-4 text-gray-600">
                    Scanning and verifying…
                  </Text>
                </View>
              ) : (
                <View className="items-center justify-center h-64 w-full">
                  <Animatable.View
                    animation="shake"
                    duration={600}
                    className="items-center bg-red-50 rounded-2xl p-6 w-72 shadow-lg"
                  >
                    {/* Icon with pulse */}
                    <Animatable.View
                      animation="pulse"
                      easing="ease-out"
                      iterationCount="infinite"
                      duration={1500}
                      className="items-center justify-center"
                    >
                      <XCircle size={64} color="#DC2626" strokeWidth={1.5} />
                    </Animatable.View>

                    {/* Title */}
                    <Text className="text-red-600 font-extrabold text-xl mt-3">
                      Oops! Scan Failed
                    </Text>

                    {/* Message */}
                    <Text className="text-gray-600 text-center mt-2 leading-5">
                      {errorMsg ||
                        "This QR code could not be verified. Please try again."}
                    </Text>

                    {/* Retry Button */}
                    <Pressable
                      onPress={() => setScanState("idle")}
                      className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg active:scale-95"
                    >
                      <Text className="text-white font-semibold text-center text-base">
                        🔄 Try Again
                      </Text>
                    </Pressable>
                  </Animatable.View>
                </View>
              )
            ) : (
              <QRCode
                value="https://presentx.app/student/12345"
                size={200}
                color="#611FE7"
              />
            )}
          </View>
          {scanState === "success" && (
            <View className="items-center justify-center h-64 w-full">
              <Animatable.View
                animation="bounceIn"
                duration={800}
                className="items-center bg-green-50 rounded-2xl p-6 w-72 shadow-lg"
              >
                <Animatable.View
                  animation="pulse"
                  easing="ease-out"
                  iterationCount="infinite"
                  duration={1500}
                  className="items-center justify-center"
                >
                  <Text className="text-6xl">✅</Text>
                </Animatable.View>

                <Text className="text-green-600 font-extrabold text-xl mt-3">
                  Attendance Marked!
                </Text>
                <Text className="text-gray-600 text-center mt-2 leading-5">
                  You’ve been successfully marked present.
                </Text>
              </Animatable.View>
            </View>
          )}

          {/* Footer */}
          <Text className="text-center text-sm text-gray-700">
            Monday 1st January 2024
          </Text>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
