import { Opportunity } from "@/constants/types";
import { RelativePathString, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  post: Opportunity;
  link: string;
  color: string;
};

function OpportunityCard({
  post = {
    name: "Full Stack Developer",
    tags: ["Job"],
    description:
      "Designing and implementing user interfaces using HTML, CSS, and JavaScript frameworks like React or Angular. Building and maintaining server-side application logic, databases and APIs using technologies such as Node.js, Python, Ruby, or Java.Designing, implementing, and managing databases (SQL or NoSQL) to ensure data integrity and efficient retrieval.Using version control systems like Git to manage code changes and collaborate with other developers.Implementing security best practices to protect applications from vulnerabilities and threats.Automating deployment processes and managing CI/CD pipelines to streamline development and release cycles.Working with cross-functional teams, including designers, product managers, and other developers, to deliver high-quality software.",
    opportunitySpec: [
      "Proficiency in front-end technologies HTML, CSS, JavaScript frameworks like React or Angular.",
      "Proficiency in back-end technologies Node.js, Python, Ruby, Java, etc.",
      "Experience in designing and managing databases (SQL and NoSQL)",
      "Proficiency in schema design and query optimization.",
      "Strong knowledge of version control systems, particularly Git.",
      "Expertise in managing and collaborating on code repositories.",
      "Knowledge of web security best practices.",
      "Experience with performance optimization techniques.",
      "Excellent collaboration skills for working effectively in a team environment",
      "Ability to communicate technical concepts to non-technical stakeholders.",
    ],
    isVisible: true,
  },
  link,
  color = "",
}: Props) {
  const router = useRouter();
  const handleNavigate = useCallback(() => {
    router.push(link as RelativePathString);
  }, [link]);

  return (
    <TouchableOpacity
      className="border p-5 rounded-lg"
      style={{ borderColor: color }}
      onPress={handleNavigate}
    >
      <Text
        className="font-bold"
        style={{ color: color, fontFamily: "Poppins_Medium" }}
      >
        {post.name}
      </Text>
      <View className="flex-row mt-2 gap-2">
        {post.tags.map((tag, index) => (
          <Text
            key={index}
            className="text-[9px] rounded-sm font-semibold py-1 px-2.5 bg-[#E7EBF1] dark:bg-[#015CA44D] dark:text-white"
            style={{ fontFamily: "Poppins_Medium" }}
          >
            {tag}
          </Text>
        ))}
      </View>
      <Text className="mt-4 dark:text-white" numberOfLines={3}>
        {post.description}
      </Text>
    </TouchableOpacity>
  );
}

export default OpportunityCard;
