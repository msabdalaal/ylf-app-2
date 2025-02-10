import { Colors } from "@/constants/Colors";
import { Comment as CommentType } from "@/constants/types";
import dayjs from "dayjs";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = {
  comment: CommentType;
};

export default function Comment({ comment }: Props) {
  return (
    <View key={comment.id} className="flex-row gap-2">
      <View className="w-10 h-10 bg-white rounded-full overflow-hidden ">
        <Image
          source={
            comment?.user?.avatar || require("@/assets/images/avatar.png")
          }
          className="w-full h-full object-cover"
        />
      </View>
      <View
        className="px-3 pt-1 pb-3 flex-1 rounded-lg"
        style={{
          backgroundColor: Colors.light.postBackground,
        }}
      >
        <Text style={{ color: Colors.light.primary }} className="font-medium">
          {comment?.user?.name || "Profile Name"}{" "}
        </Text>
        <Text className="text-xs font-light">
          {dayjs(comment?.createdAt).format("DD MMM hh:mm A")}
        </Text>
        <Text className="text-sm mt-2 font-medium">{comment.content}</Text>
      </View>
    </View>
  );
}
