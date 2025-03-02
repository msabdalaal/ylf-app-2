import OpportunityCard from "@/components/cards/opportunityCard";
import { Colors } from "@/constants/Colors";
import { Opportunity } from "@/constants/types";
import { get } from "@/hooks/axios";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
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
  return (
    <View className="container bg-white flex-1">
      <Text
        className="mt-10 mb-8"
        style={{ fontFamily: "Poppins_Medium", color: Colors.light.primary }}
      >
        Select Your Opportunity
      </Text>
      <FlatList
        data={opportunities}
        renderItem={(post) => (
          <OpportunityCard
            link={`/opportunities/${post.item.id}`}
            post={post.item}
            color={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
          />
        )}
        keyExtractor={(post) => post.id?.toString() || ""}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

export default Opportunities;
