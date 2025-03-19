import React, { useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";

export default function VideoScreen({ videoSource }: { videoSource: string }) {
  // Create the VideoPlayer instance using the hook
  const player = useVideoPlayer(videoSource, (player) => {
    // Optional configuration (e.g., player.loop = true)
  });

  // Create a ref for VideoView to access its instance methods
  const videoViewRef = useRef(null);

  // State to track if the video has started (i.e. custom play button has been pressed)
  const [hasStarted, setHasStarted] = useState(false);

  // When the custom play button is pressed, start playback and mark that playback has started
  const handleCustomPlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      player.play();
    }
  };

  return (
    <View style={styles.container}>
      <VideoView
        // Changing the key forces VideoView to remount with new props.
        key={hasStarted ? "native" : "custom"}
        ref={videoViewRef}
        style={styles.video}
        player={player}
        // Use native controls only after the custom play button has been used.
        nativeControls={hasStarted}
        allowsFullscreen
        allowsPictureInPicture
      />

      {/* Show the custom play button only if the video has not yet started */}
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
  },
  video: {
    flex: 1,
  },
  playButton: {
    position: "absolute",
    top: "45%",
    left: "45%",
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
