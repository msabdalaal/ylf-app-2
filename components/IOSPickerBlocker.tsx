import { Platform, View } from "react-native";

export const IOSPickBlocker: React.FC<{ disabled?: boolean; children: React.ReactNode }> = ({ disabled, children }) => {
    // When disabled on iOS, completely block touch so the wheel can't scroll
    if (disabled && Platform.OS === "ios") {
      return (
        <View pointerEvents="none" style={{ opacity: 0.6 }}>
          {children}
        </View>
      );
    }
    return <>{children}</>;
  };