import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { Alert, BackHandler, Platform, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/buttons/hapticTab";
import { SafeAreaView } from "react-native-safe-area-context";
import Programs from "@/assets/icons/programs";
import Home from "@/assets/icons/home";
import Settings from "@/assets/icons/settings";

export default function TabLayout() {
  const colorScheme = useColorScheme();
useEffect(() => {
  const backHandler = () => {
    Alert.alert(
      "Exit App",
      "Are you sure you want to exit?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    );
    return true;
  };

  const backHandlerListener = BackHandler.addEventListener(
    "hardwareBackPress",
    backHandler
  );

  return () => backHandlerListener.remove();
}, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: "Feed",
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="programs"
          options={{
            title: "Programs",
            tabBarIcon: ({ color }) => <Programs color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => <Settings color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
