import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import StudentQR from "@/components/Qrcode";

const { width: screenWidth } = Dimensions.get("window");
const CARD_HEIGHT = 500;
const CARD_WIDTH = CARD_HEIGHT / 1.59;


const IDCard = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
  <>
    <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    <SafeAreaView className="flex-1 px-3 bg-white">
      {/* Header */}
      <View className="flex-row items-center py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text
          className="text-2xl ml-3 text-gray-800"
          allowFontScaling={false}
          style={{ fontFamily: "Urbanist-Bold" }}
        >
          ID Card
        </Text>
      </View>

      {/* Card Display */}
      <View className="flex-1 items-center justify-center mt-2" >
        <View
          style={{
            width: CARD_HEIGHT,
            height: CARD_WIDTH,
            transform: [{ rotate: "90deg" }],
            borderRadius: 20,
            padding: 24,
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 10,
            backgroundColor: "#0985B6",
          }}
        >
          {/* School Name */}
          <Text
            className="text-white text-center text-2xl tracking-wide mb-8"
            allowFontScaling={false}
            style={{
              fontFamily: "Poppins-Bold",
            }}
          >
            Accra Institute of Technology
          </Text>

          {/* Profile Row */}
          <View className="flex-row gap-4 items-start">
            {/* Student Image */}
            <Image
              source={require("../../assets/images/barry.jpg")}
              resizeMode="cover"
              style={{
                width: 120,
                height: 150,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />

            {/* Student Info */}
            <View className="flex-1 gap-2">
              {[
                { label: "Name", value: "Emmanuel Barry A." },
                { label: "Program", value: "BSc IT" },
                { label: "Student No", value: "ADS23B00229Y" },
                { label: "Exp. Date", value: "April 30, 2026" },
              ].map(({ label, value }, idx) => (
                <View className="flex-row gap-1" key={idx}>
                  <Text
                    className="text-white"
                    style={{
                      fontSize: 15,
                      fontFamily: "Poppins-Bold",
                    }}
                    allowFontScaling={false}
                  >
                    {label}:
                  </Text>
                  <Text
                    className="text-white"
                    style={{
                      fontSize: 15,
                      fontFamily: "Poppins-Regular",
                    }}
                    allowFontScaling={false}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* QR Code */}
          <View className="items-end -mt-20">
            <View
              style={{
                backgroundColor: "#fff",
                padding: 6,
                borderRadius: 10,
              }}
            >
              <StudentQR />
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-around mt-10 mb-8">
        <TouchableOpacity onPress={() => {}}>
          <View className="bg-white px-5 py-3 rounded-xl border border-gray-300 shadow-sm">
            <Text
              className="text-black text-base"
              style={{ fontFamily: "Urbanist-Bold" }}
              allowFontScaling={false}
            >
              Update Card
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <View className="bg-[#0985B6] px-5 py-3 rounded-xl shadow-md">
            <Text
              className="text-white text-base"
              style={{ fontFamily: "Urbanist-Bold" }}
              allowFontScaling={false}
            >
              Print Card
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </>
);

};

export default IDCard;
