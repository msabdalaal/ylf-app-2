import React, { useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";

export default function VideoScreen({ videoSource }: { videoSource: string }) {
  const player = useVideoPlayer(videoSource, (player) => {
  });

  const videoViewRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleCustomPlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      player.play();
    }
  };

  return (
    <View style={styles.container}>
      <VideoView
        key={hasStarted ? "native" : "custom"}
        ref={videoViewRef}
        style={styles.video}
        player={player}
        nativeControls={hasStarted}
        allowsFullscreen
        allowsPictureInPicture
      />

      {!hasStarted && (
        <TouchableOpacity style={styles.playButton} onPress={handleCustomPlay}>
          <Ionicons name="play" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  video: {
    flex: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  playButton: {
    position: "absolute",
    top: "40%",
    left: "40%",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 25,
  },
  fullscreenButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },
});
