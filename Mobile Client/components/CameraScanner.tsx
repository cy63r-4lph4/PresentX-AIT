// components/CameraScanner.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Camera, CameraType, CameraView } from "expo-camera";
import { BarcodeScanningResult } from "expo-camera/build/Camera.types";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "@env";

interface CameraScannerProps {
  onScanned: (result: { token: string }) => void;
}

export default function CameraScanner({ onScanned }: CameraScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const secretKey = SECRET_KEY;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
  if (!scanned) {
    try {
      const decoded = decodeURIComponent(result.data);
      const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      const decryptedData = JSON.parse(decrypted);
      onScanned({ token: decryptedData.token });
      setScanned(true);
    } catch (error) {
      console.error("Error decrypting QR code:", error);
    }
  }
};


  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5344C8" />
        <Text className="mt-2 text-sm text-gray-500">
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text className="text-red-600">No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <View style={styles.overlay}>
        <Text className="text-white text-sm font-medium">Scan QR Code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#5344C8",
  },
  overlay: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  centered: {
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
});
