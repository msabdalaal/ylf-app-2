import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { View, ViewStyle } from "react-native";

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          borderRadius: 100,
          marginHorizontal: 4,
          width: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PlatformPressable
          {...props}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 60,
          }}
          android_ripple={{
            // color: "rgba(255, 255, 255, 0.2)",
            borderless: false,
            radius: 60,
          }}
          onPressIn={(ev) => {
            if (process.env.EXPO_OS === "ios") {
              // Add a soft haptic feedback when pressing down on the tabs.
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            props.onPressIn?.(ev);
          }}
        />
      </View>
    </View>
  );
}
