import AngleRight from "@/assets/icons/Angle-right";
import Logout from "@/assets/icons/logout";
import UserIcon from "@/assets/icons/user";
import { Colors } from "@/constants/Colors";
import { remove } from "@/hooks/storage";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

type Props = {};

function Settings({}: Props) {
  const router = useRouter();
  const theme = useColorScheme();

  const logout = async () => {
    await remove("token");
    router.replace("/");
  };

  return (
    <View
      className="container bg-white flex-1"
      style={{
        backgroundColor: Colors[theme == "dark" ? "dark" : "light"].background,
      }}
    >
      <Text
        className="text-xl text-center mt-10 mb-9"
        style={{
          fontFamily: "Poppins_Medium",
          color: theme == "dark" ? "white" : Colors.light.primary,
        }}
      >
        Settings
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/settings/profile")}
        className="bg-[#F6F8FA] dark:bg-[#015CA41A] flex-row justify-between items-center p-6 rounded-3xl"
      >
        <View className="flex-row items-center gap-4">
          <View className="bg-white w-11 h-11 rounded-full justify-center items-center">
            <UserIcon />
          </View>
          <Text
            className="dark:text-white"
            style={{ fontFamily: "Poppins_Medium" }}
          >
            Personal Info
          </Text>
        </View>
        <AngleRight color={theme == "dark" ? "white" : ""} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logout}
        className="bg-[#F6F8FA] dark:bg-[#015CA41A] flex-row justify-between mt-6 items-center p-6 rounded-3xl"
      >
        <View className="flex-row items-center gap-4">
          <View className="bg-[#F6F8FA] w-11 h-11 rounded-full justify-center items-center">
            <Logout />
          </View>
          <Text
            className="dark:text-white"
            style={{ fontFamily: "Poppins_Medium" }}
          >
            Log Out
          </Text>
        </View>
        <AngleRight color={theme == "dark" ? "white" : ""} />
      </TouchableOpacity>
    </View>
  );
}

export default Settings;
