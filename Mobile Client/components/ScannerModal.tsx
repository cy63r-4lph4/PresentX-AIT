import React, { useMemo, useRef, useState } from "react";
import { View, Text, Image, Pressable, Switch } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Camera } from "lucide-react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Event } from "./Interfaces";
import CameraScanner from "./CameraScanner";
import { useMarkAttendance } from "@/hooks/MarkAttendance";

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
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const {
    mutate: mark,
    isPending,
    isError,
    error,
    isSuccess,
    data,
    reset,
  } = useMarkAttendance();
  const handleScanned = (result) => {
    mark(result.data);
    visible && sheetRef.current?.close();
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
      //   enableHandlePanningGesture={false}
      handleIndicatorStyle={{ backgroundColor: "#611FE7" }}
    >
      <BottomSheetView className="flex-1">
        <View className="flex-1 px-4 h-full">
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
            <Switch
              className=""
              value={mode === "be-scanned"}
              onValueChange={toggleMode}
            />
          </View>

          {/* QR or Camera */}
          <View className="items-center justify-center py-6 mb-4">
            {mode === "scan" ? (
              <CameraScanner onScanned={handleScanned} />
            ) : (
              <QRCode
                value="https://presentx.app/student/12345"
                size={200}
                color="#611FE7"
              />
            )}
          </View>

          {/* Footer */}
          <Text className="text-center text-sm text-gray-700">
            Monday 1st January 2024
          </Text>

          {/* <Pressable
            onPress={onClose}
            className="mt-4 bg-purple-600 py-2 rounded-xl items-center"
          >
            <Text className="text-white font-medium">Close</Text>
          </Pressable> */}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
