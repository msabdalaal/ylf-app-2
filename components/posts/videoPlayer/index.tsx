import Pause from "@/assets/icons/pause";
import Play from "@/assets/icons/play";
import { Colors } from "@/constants/Colors";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function VideoScreen() {
  const player = useVideoPlayer(videoSource, (player) => {
    // player.loop = true;
    // player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const colorScheme = useColorScheme();

  return (
    <View style={styles.contentContainer}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls={false}
      />
      <TouchableOpacity
        onPress={() => {
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full justify-center items-center"
        style={{ backgroundColor: Colors[colorScheme ?? "light"].postFooter }}
      >
        {isPlaying ? <Pause /> : <Play />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    borderRadius: 20,
    overflow: "hidden",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    //   paddingBottom: 80,
  },
});
