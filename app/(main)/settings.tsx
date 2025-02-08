import AngleRight from "@/assets/icons/Angle-right";
import Logout from "@/assets/icons/logout";
import { Colors } from "@/constants/Colors";
import { remove } from "@/hooks/storage";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {};

function Settings({}: Props) {
  const router = useRouter();

  const logout = async () => {
    await remove("token");
    router.replace("/");
  };
  return (
    <View className="container bg-white flex-1">
      <Text
        className="text-xl text-center mt-10 mb-9"
        style={{ fontFamily: "Poppins_Medium", color: Colors.light.primary }}
      >
        Settings
      </Text>
      <TouchableOpacity
        onPress={logout}
        className="bg-[#F6F8FA] flex-row justify-between items-center p-6 rounded-3xl"
      >
        <View className="flex-row items-center gap-4">
          <View className="bg-white w-11 h-11 rounded-full justify-center items-center">
            <Logout />
          </View>
          <Text style={{ fontFamily: "Poppins_Medium" }}>Log Out</Text>
        </View>
        <AngleRight />
      </TouchableOpacity>
    </View>
  );
}

export default Settings;
