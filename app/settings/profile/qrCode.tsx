import { Image, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import { ApplicationContext } from "@/context";
import QRCode from "react-native-qrcode-svg";
import { useTheme } from "@/context/ThemeContext";

type Props = {};

const QrCode = (props: Props) => {
  const { state } = useContext(ApplicationContext);

  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="bg-white flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <View className="container">

      <View className=" flex-row items-center gap-3 mb-6 mt-5">
        <BackButton />
        <Text
          style={{
            fontFamily: "Poppins_Medium",
            color: Colors[theme ?? "light"].primary,
          }}
        >
          Qr Code
        </Text>
      </View>
      <View className="justify-center items-center ">
        <View className="bg-white p-6">
          <QRCode value={state.user?.id?.toString()} size={200} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QrCode;
