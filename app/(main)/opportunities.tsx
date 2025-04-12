import OpportunityCard from "@/components/cards/opportunityCard";
import { Colors } from "@/constants/Colors";
import { Opportunity } from "@/constants/types";
import { useLoading } from "@/context/LoadingContext";
import { useTheme } from "@/context/ThemeContext";
import { get } from "@/hooks/axios";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Text, View } from "react-native";

function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const { showLoading, hideLoading } = useLoading();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const getOpportunities = useCallback(async (showLoader = true) => {
    if (showLoader) showLoading();
    await get("opportunities/getAll")
      .then((res) => {
        setOpportunities(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (showLoader) hideLoading();
      });
  }, []);

  useEffect(() => {
    getOpportunities();
  }, [getOpportunities]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getOpportunities(false);
    setRefreshing(false);
  };

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
        className="mb-2"
        refreshing={refreshing}
        onRefresh={onRefresh}
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
