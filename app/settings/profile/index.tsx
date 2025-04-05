import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import { ApplicationContext } from "@/context";
import imageUrl from "@/utils/imageUrl";
import UserIcon from "@/assets/icons/user";
import Phone from "@/assets/icons/Phone";
import PrimaryLink from "@/components/links/primary";
import Email from "@/assets/icons/email";
import QrCode from "@/assets/icons/qrCode";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { get } from "@/hooks/axios";
type Props = {};

const profile = (props: Props) => {
  const {
    state: { user },
  } = useContext(ApplicationContext);
  const { updateState } = useContext(ApplicationContext);
  const router = useRouter();
  const { theme } = useTheme();
  const getProfile = useCallback(async () => {
    try {
      const res = await get("users/profile");
      const user = res.data.data;
      updateState("user", user);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  }, []);
  useEffect(() => {
    getProfile();
  }, [getProfile]);
  return (
    <SafeAreaView
      className="container bg-white flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <View className=" flex-row items-center gap-3 mb-6 mt-5">
        <BackButton />
        <Text
          style={{
            fontFamily: "Poppins_Medium",
            color: Colors[theme ?? "light"].primary,
          }}
        >
          Profile
        </Text>
      </View>
      <View className="w-full flex-row items-center gap-5">
        <View className="h-24 w-24 bg-[#015CA480] rounded-full overflow-hidden">
          <Image
            src={imageUrl(user?.avatar?.path || "")}
            className="w-full h-full object-cover"
          />
        </View>
        <View className="w-full flex-row items-between gap-3">
          <View>
            <Text
              className="text-xl"
              style={{
                fontFamily: "Poppins_Medium",
                color: Colors[theme ?? "light"].primary,
              }}
            >
              {user?.name?.split(" ").length === 1
                ? user.name
                : user?.name?.split(" ")?.[0] +
                  " " +
                  user?.name?.split(" ")?.[1]?.[0] +
                  "."}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/settings/profile/qrCode")}
          >
            <QrCode color={Colors[theme ?? "light"].primary} />
          </TouchableOpacity>
        </View>
      </View>
      {Array.isArray(user?.programApplications) &&
        user?.programApplications?.length > 0 && (
          <Text className="mt-2 dark:text-white">Registered With:</Text>
        )}
      <View className="flex-row items-center gap-3 mt-2">
        {Array.isArray(user?.programApplications) &&
          user?.programApplications?.length > 0 &&
          user.programApplications.map((program, index) => (
            <View className="items-center">
              <Image
                key={index}
                src={imageUrl(program.program.logo.path)}
                resizeMode="contain"
                className="h-20 w-20 bg-white rounded-full"
              />
              <Text className="text-sm">{program.program.name}</Text>
            </View>
          ))}
      </View>
      {Array.isArray(user?.groupLeader) && user?.groupLeader?.length > 0 && (
        <Text className="mt-2 dark:text-white">Leader of:</Text>
      )}
      <View className=" items-start gap-3 mt-2">
        {Array.isArray(user?.groupLeader) &&
          user?.groupLeader?.length > 0 &&
          user.groupLeader.map((group, index) => (
            <View className="flex-row items-center">
              <Text className="text-sm">{group.name}</Text>
              <Text className="text-sm"> ({group.referenceCode})</Text>
            </View>
          ))}
      </View>
      <View className="bg-[#F6F8FA] dark:bg-[#015CA41A] gap-4 justify-start mt-6 items-start p-6 rounded-3xl">
        <View className="flex-row items-center gap-4">
          <View className="bg-white w-11 h-11 rounded-full justify-center items-center">
            <UserIcon />
          </View>
          <View>
            <Text
              className="dark:text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 16 }}
            >
              Full Name
            </Text>
            <Text className="text-sm dark:text-white">{user?.name}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="bg-white w-11 h-11 rounded-full justify-center items-center">
            <Email />
          </View>
          <View>
            <Text
              className="dark:text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 16 }}
            >
              Email
            </Text>
            <Text className="text-sm dark:text-white">{user?.email}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="bg-white w-11 h-11 rounded-full justify-center items-center">
            <Phone />
          </View>
          <View>
            <Text
              className="dark:text-white"
              style={{ fontFamily: "Poppins_Medium", lineHeight: 16 }}
            >
              Phone Number
            </Text>
            <Text className="text-sm dark:text-white">
              {user?.phoneNumber ?? "-"}
            </Text>
          </View>
        </View>
      </View>
      <PrimaryLink href="/settings/profile/edit" className="mt-7">
        More Details
      </PrimaryLink>
    </SafeAreaView>
  );
};

export default profile;
