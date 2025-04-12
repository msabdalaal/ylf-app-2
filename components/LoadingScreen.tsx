import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Animated,
  Easing,
  StyleSheet,
  BackHandler,
} from "react-native";


export default function LoadingScreen() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      scaleAnim.setValue(0.8);
    };
  }, [scaleAnim]);

  useEffect(() => {
    const onBackPress = () => true;
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => {
      backHandler.remove();
    };
  }, []);


  return (
    <View style={styles.overlay} pointerEvents="box-only">
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim.interpolate({
              inputRange: [0.8, 1.2],
              outputRange: [0.7, 1],
            }),
          },
        ]}
      >
        <Image
          source={require("@/assets/images/splash-icon-dark.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  animatedContainer: {},
  image: {
    width: 128,
    height: 64,
  },
});
