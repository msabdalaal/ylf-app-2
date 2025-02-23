import { View, Text, Image } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import { ApplicationContext } from "@/context";
import imageUrl from "@/utils/imageUrl";
import UserIcon from "@/assets/icons/user";
import Phone from "@/assets/icons/Phone";
import PrimaryLink from "@/components/links/primary";
import Email from "@/assets/icons/email";
type Props = {};

const profile = (props: Props) => {
  const {
    state: { user },
  } = useContext(ApplicationContext);
  return (
    <SafeAreaView className="container bg-white flex-1">
      <View className=" flex-row items-center gap-3 mb-6 mt-5">
        <BackButton />
        <Text
          style={{
            fontFamily: "Poppins_Medium",
            color: Colors.light.primary,
          }}
        >
          Profile
        </Text>
      </View>
      <View className="flex-row items-center gap-5">
        <View className="h-24 w-24 bg-[#015CA480] rounded-full">
          <Image
            src={imageUrl(user?.avatar || "")}
            className="w-full h-full object-cover"
          />
        </View>
        <Text
          className="text-xl"
          style={{ fontFamily: "Poppins_Medium", color: Colors.light.primary }}
        >
          {user?.name?.split(" ")?.[0] +
            " " +
            user?.name?.split(" ")?.[1]?.[0] +
            "."}
        </Text>
      </View>
      <View className="bg-[#F6F8FA] gap-4 justify-start mt-6 items-start p-6 rounded-3xl">
        <View className="flex-row items-center gap-4">
          <View className="bg-white w-11 h-11 rounded-full justify-center items-center">
            <UserIcon />
          </View>
          <View>
            <Text style={{ fontFamily: "Poppins_Medium", lineHeight: 16 }}>
              Full Name
            </Text>
            <Text className="text-sm">{user?.name}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="bg-white w-11 h-11 rounded-full justify-center items-center">
            <Email />
          </View>
          <View>
            <Text style={{ fontFamily: "Poppins_Medium", lineHeight: 16 }}>
              Email
            </Text>
            <Text className="text-sm">{user?.email}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="bg-white w-11 h-11 rounded-full justify-center items-center">
            <Phone />
          </View>
          <View>
            <Text style={{ fontFamily: "Poppins_Medium", lineHeight: 16 }}>
              Phone Number
            </Text>
            <Text className="text-sm">{user?.phoneNumber ?? "-"}</Text>
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
