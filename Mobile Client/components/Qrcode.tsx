import React from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const student = {
  name: "Kwame Mensah",
  id: "AIT20231001",
  program: "BSc. Computer Science",
  nationality: "Ghanaian",
  expiry: "2025-06-30",
};

const StudentQR = () => {
  const qrData = JSON.stringify(student);

  return (
    <View className="">
      <QRCode value={qrData} size={80} color="#000" backgroundColor="#fff" />
    </View>
  );
};

export default StudentQR;
