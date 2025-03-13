import OpportunityCard from "@/components/cards/opportunityCard";
import { Colors } from "@/constants/Colors";
import { Opportunity } from "@/constants/types";
import { useTheme } from "@/context/ThemeContext";
import { get } from "@/hooks/axios";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const { theme } = useTheme();
  const getOpportunities = useCallback(async () => {
    await get("opportunities/getAll")
      .then((res) => {
        setOpportunities(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    getOpportunities();
  }, []);

  const getCardColor = (tags: string[]) => {
    if (tags.includes("scholarships")) return "#E7C11E";
    if (tags.includes("event")) return "#015CA4";
    if (tags.includes("job")) return "#EC5D52";
    return "#015CA4";
  };

  return (
    <View
      className="container bg-white flex-1"
      style={{
        backgroundColor: Colors[theme == "dark" ? "dark" : "light"].background,
      }}
    >
      <Text
        className="mt-10 mb-8"
        style={{
          fontFamily: "Poppins_Medium",
          color: theme == "dark" ? "white" : Colors.light.primary,
        }}
      >
        Select Your Opportunity
      </Text>
      <FlatList
        data={opportunities}
        renderItem={(post) => (
          <OpportunityCard
            link={`/opportunities/${post.item.id}`}
            post={post.item}
            color={getCardColor(post.item.tags)}
          />
        )}
        keyExtractor={(post) => post.id?.toString() || ""}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

export default Opportunities;
