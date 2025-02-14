import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function application() {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView className="container">
      <View className="flex-row items-center gap-4 mt-5">
        <BackButton />
        <Text
          style={{
            fontFamily: "Poppins_Medium",
            color: Colors.light.primary,
            lineHeight: 20,
          }}
        >
          Applying Form
        </Text>
      </View>
    </SafeAreaView>
  );
}
