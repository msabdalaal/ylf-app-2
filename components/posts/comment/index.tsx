import Dots from "@/assets/icons/dots";
import { Colors } from "@/constants/Colors";
import { Comment as CommentType } from "@/constants/types";
import { ApplicationContext } from "@/context";
import { useTheme } from "@/context/ThemeContext";
import imageUrl from "@/utils/imageUrl";
import dayjs from "dayjs";
import React, { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  comment: CommentType;
  onDelete: (commentId: string) => void;
};

export default function Comment({ comment, onDelete }: Props) {
  const [showMenu, setShowMenu] = React.useState(false);

  const handlePress = () => setShowMenu((prev) => !prev);
  const { state } = useContext(ApplicationContext);

  const handleDelete = () => {
    onDelete(comment.id);
    setShowMenu(false);
  };
  const { theme } = useTheme();

  return (
    <View key={comment.id} className="flex-row gap-2">
      <View className="w-10 h-10 bg-white rounded-full overflow-hidden items-center justify-center ">
        {comment?.user?.avatar?.path ? (
          <Image
            src={imageUrl(comment.user.avatar.path)}
            className="w-full h-full object-cover"
          />
        ) : (
          <View
            style={{
              backgroundColor: Colors.light.primary,
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
                fontFamily: "Poppins_Medium",
              }}
            >
              {(() => {
                const name = comment?.user?.name || "";
                const parts = name.trim().split(" ");
                if (parts.length === 1) {
                  return parts[0][0]?.toUpperCase() || "";
                }
                return (
                  parts[0][0]?.toUpperCase() +
                  (parts[1][0]?.toUpperCase() ||
                    parts[parts.length - 1][0]?.toUpperCase() ||
                    "")
                );
              })()}
            </Text>
          </View>
        )}
      </View>
      <View
        className="px-3 pt-1 pb-3 flex-1 rounded-lg"
        style={{
          backgroundColor: Colors[theme ?? "light"].postBackground,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Text
            style={{ color: Colors[theme ?? "light"].primary }}
            className="font-medium"
          >
            {comment?.user?.name || "Profile Name"}{" "}
          </Text>
          {state.user?.email === comment?.user?.email && (
            <TouchableOpacity onPress={handlePress}>
              <Dots />
              {showMenu && (
                <View className="absolute right-0 top-8 bg-white rounded-md shadow-lg px-2 py-1">
                  <TouchableOpacity onPress={handleDelete} className="w-20">
                    <Text className="text-red-500">Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-xs font-light dark:text-white">
          {dayjs(comment?.createdAt).format("DD MMM hh:mm A")}
        </Text>
        <Text className="text-sm mt-2 font-medium dark:text-white">
          {comment.content}
        </Text>
      </View>
    </View>
  );
}
