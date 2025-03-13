import { FlatList, ScrollView, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/buttons/backButton";
import { Colors } from "@/constants/Colors";
import { get } from "@/hooks/axios";
import { Opportunity } from "@/constants/types";
import { useLocalSearchParams } from "expo-router";
import PrimaryLink from "@/components/links/primary";
import { useTheme } from "@/context/ThemeContext";
const OpportunityPage = () => {
  const { id } = useLocalSearchParams();
  const [opportunity, setOpportunity] = useState<Opportunity>();
  const getOpportunity = useCallback(async () => {
    await get("opportunities/getOne/" + id)
      .then((res) => {
        setOpportunity(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    getOpportunity();
  }, []);
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="bg-white flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <ScrollView className="flex-1">
        <View className=" container flex-row items-center gap-3 mb-6 mt-5">
          <BackButton />
          <Text
            style={{
              fontFamily: "Poppins_Medium",
              color: Colors[theme ?? "light"].primary,
            }}
          >
            Opportunities
          </Text>
        </View>
        <View className="container">
          <Text className="text-lg font-bold dark:text-white">
            {opportunity?.name}
          </Text>
          <View className="flex-row mt-2 gap-2">
            {Array.isArray(opportunity?.tags) &&
              opportunity?.tags.map((tag, index) => (
                <Text
                  key={index}
                  className="text-[9px] rounded-sm font-semibold py-1 px-2.5 bg-[#E7EBF1]"
                  style={{ fontFamily: "Poppins_Medium" }}
                >
                  {tag}
                </Text>
              ))}
          </View>
          {opportunity?.description ? (
            <Text className="font-bold my-2 dark:text-white">Description:</Text>
          ) : null}
          <Text className="dark:text-white">{opportunity?.description}</Text>
          {opportunity?.opportunitySpec ? (
            <Text className="font-bold my-2 dark:text-white">
              Job Specification:
            </Text>
          ) : null}
          <View className="gap-1">
            {opportunity?.opportunitySpec?.map((spec, index) => (
              <View key={index} className="flex-row items-start gap-2">
                <Text className="text-[#404040] dark:text-white">•</Text>
                <Text
                  className="flex-1 dark:text-white"
                  style={{ fontFamily: "SF_pro" }}
                >
                  {spec}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View
        className="py-6 px-7 bg-[#F0F5FA] mt-2"
        style={{
          backgroundColor: theme == "dark" ? "#21252d" : "#F0F5FA",
        }}
      >
        <PrimaryLink href={`/`}>Apply Now</PrimaryLink>
      </View>
    </SafeAreaView>
  );
};

export default OpportunityPage;
