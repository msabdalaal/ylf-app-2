import React, { useEffect } from "react";
import { Tabs, usePathname, useRouter } from "expo-router";
import { Alert, BackHandler, Platform } from "react-native";
import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/buttons/hapticTab";
import { SafeAreaView } from "react-native-safe-area-context";
import Programs from "@/assets/icons/programs";
import Home from "@/assets/icons/home";
import Settings from "@/assets/icons/settings";
import Opportunities from "@/assets/icons/opportunities";
import { View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  const { theme } = useTheme();
  const pathname = usePathname();
  useEffect(() => {
    const backHandler = () => {
      if (
        pathname === "/feed" ||
        pathname === "/programs" ||
        pathname === "/settings"
      ) {
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
      }
    };

    const backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );

    return () => backHandlerListener.remove();
  }, [pathname]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <Tabs
        screenOptions={{
          animation: "none",
          tabBarActiveTintColor: "#015CA4",
          tabBarInactiveTintColor: "white",
          tabBarActiveBackgroundColor: "#015CA4",
          tabBarInactiveBackgroundColor: "#015CA4",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: "#015CA4",
            height: 65, // Slightly increased height
            borderTopWidth: 0,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowOpacity: 0,
            paddingVertical: 8,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
          },
          tabBarLabelStyle: {
            fontFamily: "SF_pro",
            fontSize: 11, // Slightly smaller font
            color: "white",
          },
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <View
                className={`rounded-full p-1 ${
                  color === Colors.light.primary
                    ? "bg-[#E7C11E]"
                    : "bg-transparent"
                }`}
              >
                <Home color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="programs"
          options={{
            title: "Programs",
            tabBarIcon: ({ color }) => (
              <View
                className={`rounded-full p-1 ${
                  color === Colors.light.primary
                    ? "bg-[#E7C11E]"
                    : "bg-transparent"
                }`}
              >
                <Programs color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="opportunities"
          options={{
            title: "Opportunities",
            tabBarIcon: ({ color }) => (
              <View
                className={`rounded-full p-1 ${
                  color === Colors.light.primary
                    ? "bg-[#E7C11E]"
                    : "bg-transparent"
                }`}
              >
                <Opportunities color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <View
                className={`rounded-full p-1 ${
                  color === Colors.light.primary
                    ? "bg-[#E7C11E]"
                    : "bg-transparent"
                }`}
              >
                <Settings color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
