import Filters from "@/assets/icons/filters";
import Search from "@/assets/icons/search";
import PrimaryButton from "@/components/buttons/primary";
import OpportunityCard from "@/components/cards/opportunityCard";
import TextInputComponent from "@/components/inputs/textInput";
import { Colors } from "@/constants/Colors";
import { Opportunity } from "@/constants/types";
import { useLoading } from "@/context/LoadingContext";
import { useTheme } from "@/context/ThemeContext";
import { get } from "@/hooks/axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const { showLoading, hideLoading } = useLoading();
  const { theme } = useTheme();

  const getOpportunities = useCallback(async (showLoader = true) => {
    if (showLoader) showLoading();
    await get("opportunities/getAll")
      .then((res) => {
        const fetched = res.data.data;
        setOpportunities(fetched);

        const tagsSet = new Set<string>();
        fetched.forEach((op: Opportunity) => {
          op.tags?.forEach((tag: string) => tagsSet.add(tag.toLowerCase()));
        });
        setAllTags([...tagsSet]);
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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredOpportunities = opportunities.filter((op) => {
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) =>
        op.tags?.map((t) => t.toLowerCase()).includes(tag)
      );

    const matchesSearch =
      searchQuery.trim() === "" ||
      op.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTags && matchesSearch;
  });

  const getCardColor = (tags: string[]) => {
    if (tags.includes("scholarships")) return "#E7C11E";
    if (tags.includes("event")) return "#015CA4";
    if (tags.includes("job")) return "#EC5D52";
    return "#015CA4";
  };

  return (
    <View
      className="bg-white flex-1"
      style={{
        backgroundColor: Colors[theme == "dark" ? "dark" : "light"].background,
      }}
    >
      <View className="container">
        <Text
          className="mt-10 mb-6"
          style={{
            fontFamily: "Poppins_Medium",
            color: theme == "dark" ? "white" : Colors.light.primary,
          }}
        >
          Select Your Opportunity
        </Text>

        {/* Search + Filter Button */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="flex-1">
            <TextInputComponent
              icon={<Search />}
              placeholder="Find an Opportunity"
              value={searchQuery}
              onChange={(text) => setSearchQuery(text)}
            />
          </View>
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            className="justify-center items-center rounded-xl"
            style={{
              backgroundColor: Colors.light.primary,
              height: 53,
              width: 53,
            }}
          >
            <Filters />
          </TouchableOpacity>
        </View>

        {/* Selected Tag Chips */}
        {selectedTags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-3">
            {selectedTags.map((tag) => (
              <View
                key={tag}
                className="flex-row items-center bg-gray-100 dark:bg-[#015CA41A] px-3 py-2 rounded-md"
              >
                <Text
                  className="mr-2"
                  style={{
                    color: Colors[theme == "dark" ? "dark" : "light"].primary,
                    fontWeight: "600",
                  }}
                >
                  {tag}
                </Text>
                <TouchableOpacity onPress={() => toggleTag(tag)}>
                  <Text className="text-red-600 font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Filter Modal with dim background and outside tap to close */}
        <Modal
          visible={isFilterModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setFilterModalVisible(false)}
          >
            <View className="flex-1 bg-black/40 justify-end">
              <TouchableWithoutFeedback>
                <View className="bg-white dark:bg-[#171A1F] p-5 rounded-t-2xl">
                  <Text className="font-bold text-lg mb-3 dark:text-white">
                    Filter by Tags
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <TouchableOpacity
                          key={tag}
                          onPress={() => toggleTag(tag)}
                          className={`px-4 py-1 rounded-md border ${
                            selectedTags.includes(tag)
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <Text
                            className={`text-md ${
                              selectedTags.includes(tag)
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            {tag}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                  <PrimaryButton
                    className="mt-4"
                    onPress={() => setFilterModalVisible(false)}
                  >
                    Apply Filters
                  </PrimaryButton>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Opportunities List */}
        <FlatList
          className="mb-2 mt-2"
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={filteredOpportunities}
          renderItem={({ item }) => (
            <OpportunityCard
              link={`/opportunities/${item.id}`}
              post={item}
              color={getCardColor(item.tags)}
            />
          )}
          keyExtractor={(post) => post.id?.toString() || ""}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </View>
  );
}

export default Opportunities;
