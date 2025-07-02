import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
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
import { useLoading } from "@/context/LoadingContext";
import * as Clipboard from "expo-clipboard";
type Props = {};

const profile = (props: Props) => {
  const {
    state: { user },
  } = useContext(ApplicationContext);
  const { showLoading, hideLoading } = useLoading();
  const { updateState } = useContext(ApplicationContext);
  const router = useRouter();
  const { theme } = useTheme();
  const getProfile = useCallback(async () => {
    try {
      showLoading();
      const res = await get("users/profile");
      const user = res.data.data;
      updateState("user", user);
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      hideLoading();
    }
  }, []);
  useEffect(() => {
    getProfile();
  }, [getProfile]);
  console.log(user);
  return (
    <SafeAreaView
      className="bg-white flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <View className="container flex-1">
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
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="w-full flex-row items-center gap-5">
            <View className="h-24 w-24 bg-[#015CA480] dark:bg-[#015CA460] rounded-full overflow-hidden">
              <Image
                src={imageUrl(user?.avatar?.path || "")}
                className="w-full h-full object-cover"
              />
            </View>
            <View className="w-full flex-row items-between gap-3">
              <View>
                <Text
                  className="text-xl dark:text-white"
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
              <Text
                className="mt-6 mb-3 dark:text-white"
                style={{
                  fontFamily: "Poppins_Medium",
                  color: Colors[theme ?? "light"].primary,
                }}
              >
                Registered With:
              </Text>
            )}
          <View className="flex-row items-center gap-4 mt-2 mb-4">
            {Array.isArray(user?.programApplications) &&
              user?.programApplications?.length > 0 &&
              user.programApplications.map((program, index) => (
                <View key={index} className="items-center">
                  <View className="h-20 w-20 bg-white dark:bg-gray-800 rounded-full shadow-sm overflow-hidden mb-2">
                    <View
                      style={{ backgroundColor: "#015CA4" }}
                      className="absolute w-full h-full rounded-full items-center justify-center z-0 p-2"
                    >
                      <View className="w-full h-full rounded-full z-0 overflow-hidden">
                        <Image
                          src={imageUrl(program.program.logo.path)}
                          resizeMode="contain"
                          className="w-full h-full z-10"
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    className="text-sm dark:text-white text-center"
                    style={{ fontFamily: "Poppins_Medium" }}
                  >
                    {program.program.name}
                  </Text>
                </View>
              ))}
          </View>
          {Array.isArray(user?.groupLeader) &&
            user?.groupLeader?.length > 0 && (
              <Text
                className="mt-6 mb-3 dark:text-white"
                style={{
                  fontFamily: "Poppins_Medium",
                  color: Colors[theme ?? "light"].primary,
                }}
              >
                Leader of:
              </Text>
            )}
          <View className="items-start gap-3 mb-4">
            {Array.isArray(user?.groupLeader) &&
              user?.groupLeader?.length > 0 &&
              user.groupLeader.map((group) => (
                <View
                  key={group.id}
                  className="w-full bg-[#F6F8FA] dark:bg-[#015CA41A] rounded-3xl p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text
                        className="text-base dark:text-white mb-1"
                        style={{
                          fontFamily: "Poppins_Medium",
                          color: Colors[theme ?? "light"].primary,
                        }}
                      >
                        {group.name}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={async () => {
                        await Clipboard.setStringAsync(group.referenceCode);
                        Alert.alert(
                          "Copied!",
                          "Reference code copied to clipboard"
                        );
                      }}
                      className="flex-row items-center gap-2 px-4 py-2 rounded-2xl shadow-sm"
                      style={{
                        backgroundColor: Colors[theme ?? "light"].primary,
                      }}
                    >
                      <View className="flex-col items-center justify-center">
                        <Text
                          className="text-[10px] text-white dark:text-black font-bold"
                          style={{ fontFamily: "Poppins_Medium" }}
                        >
                          Reference Code
                        </Text>
                        <Text
                          className="text-sm text-white dark:text-black font-bold"
                          style={{ fontFamily: "Poppins_Medium" }}
                        >
                          {group.referenceCode}
                        </Text>
                      </View>
                      <Text className="text-white text-sm">📋</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
          {(() => {
            if (!Array.isArray(user?.groups) || user?.groups?.length === 0)
              return null;
            const filteredGroups = user.groups.filter(
              (group) =>
                !Array.isArray(user?.groupLeader) ||
                !user.groupLeader.some(
                  (leaderGroup) => leaderGroup.id === group.id
                )
            );
            if (filteredGroups.length === 0) return null;
            return (
              <>
                <Text
                  className="mt-6 mb-3 dark:text-white"
                  style={{
                    fontFamily: "Poppins_Medium",
                    color: Colors[theme ?? "light"].primary,
                  }}
                >
                  Member of:
                </Text>
                <View className="flex-row items-center gap-4 mt-2 mb-4">
                  {filteredGroups.map((group, index) => (
                    <View key={index} className="items-center">
                      <View className="h-20 w-20 bg-white dark:bg-gray-800 rounded-full shadow-sm overflow-hidden mb-2">
                        <View
                          style={{ backgroundColor: "#015CA4" }}
                          className="absolute w-full h-full rounded-full items-center justify-center z-0 p-2"
                        >
                          <View className="w-full h-full rounded-full z-0 overflow-hidden">
                            <Image
                              src={imageUrl(group.program.logo.path)}
                              resizeMode="contain"
                              className="w-full h-full z-10"
                            />
                          </View>
                        </View>
                      </View>
                      <Text
                        className="text-sm dark:text-white text-center mb-1"
                        style={{ fontFamily: "Poppins_Medium" }}
                      >
                        {group.name}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {group.program.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            );
          })()}
          <View className="bg-[#F6F8FA] dark:bg-[#015CA41A] gap-4 justify-start mt-6 items-start p-6 rounded-3xl">
            <View className="flex-row items-center gap-4">
              <View className="bg-white dark:bg-gray-800 w-11 h-11 rounded-full justify-center items-center">
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
              <View className="bg-white dark:bg-gray-800 w-11 h-11 rounded-full justify-center items-center">
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
              <View className="bg-white dark:bg-gray-800 w-11 h-11 rounded-full justify-center items-center">
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
          <View className="h-10" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default profile;
