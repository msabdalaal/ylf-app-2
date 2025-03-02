import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/buttons/backButton";
import TextInputComponent from "@/components/inputs/textInput";
import { Colors } from "@/constants/Colors";
import { Question } from "@/constants/types";
import { get, post } from "@/hooks/axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import PrimaryButton from "@/components/buttons/primary";
import uploadFile from "@/utils/uploadFile";

export default function Application() {
  const { id } = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch questions from the API
  const getQuestions = useCallback(async () => {
    try {
      const res = await get("programs/getProgramQuestions/" + id);
      setQuestions(res.data.data);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  }, [id]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  // Update formData on user input and clear any previous error
  const handleInputChange = (questionId: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [questionId]: value,
    }));
    if (errors[questionId]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [questionId]: "",
      }));
    }
  };

  // Use Expo DocumentPicker for file uploads
  const handleFilePick = async (questionId: string) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });
    if (!result.canceled) {
      handleInputChange(questionId, result.assets[0].uri);
    }
  };

  // Validate required fields
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    questions.forEach((question) => {
      const answer = formData[question.id];
      if (
        question.required &&
        (!answer || (typeof answer === "string" && !answer.trim()))
      ) {
        valid = false;
        newErrors[question.id] = `${question.question} is required.`;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const buildRealFormData = async () => {
    const application: { questionId: string; answer: string }[] = [];
    const uploadPromises = questions.map(async (question) => {
      const answer = formData[question.id];
      if (question.type === "upload" && answer) {
        const uploadResult = await uploadFile(
          answer,
          "image/png",
          `${question.id}.png`
        );
        // application[question.id] = uploadResult;
        application.push({ questionId: question.id, answer: uploadResult });
      } else {
        // application[question.id] = answer;
        application.push({ questionId: question.id, answer: answer });
      }
    });

    await Promise.all(uploadPromises);
    return application;
  };

  const router = useRouter();
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }
    try {
      const realFormData = await buildRealFormData();
      await post("programs/submitApplication/" + id, {
        questions: realFormData,
      }).then(() => {
        router.replace(`/program/${id}/submitSuccess`);
      });
    } catch (error) {
      console.error("Error submitting application: ", error);
      Alert.alert("Error", "There was an error submitting your application.");
    }
  };

  // Render a single question based on its type
  const renderQuestion = ({ item: question }: { item: Question }) => {
    switch (question.type) {
      case "complete":
        return (
          <View className="mb-4">
            <Text className="mb-2">
              {question.question + (question.required ? " *" : "")}
            </Text>
            <TextInputComponent
              value={formData[question.id] || ""}
              onChange={(text: string) => handleInputChange(question.id, text)}
              placeholder={question.question}
            />
            {errors[question.id] && (
              <Text className="text-red-500 mt-1">{errors[question.id]}</Text>
            )}
          </View>
        );
      case "upload":
        return (
          <View className="mb-4">
            <Text className="mb-2">
              {question.question + (question.required ? " *" : "")}
            </Text>
            <TouchableOpacity
              onPress={() => handleFilePick(question.id)}
              className="border border-gray-300 p-3 rounded-lg"
            >
              <Text>
                {formData[question.id] ? "File Selected" : "Select File"}
              </Text>
            </TouchableOpacity>
            {errors[question.id] && (
              <Text className="text-red-500 mt-1">{errors[question.id]}</Text>
            )}
          </View>
        );
      case "rightWrong":
        return (
          <View className="mb-4">
            <Text className="mb-2">
              {question.question + (question.required ? " *" : "")}
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => handleInputChange(question.id, "true")}
                className={`mr-2 p-2 rounded `}
                style={{
                  backgroundColor:
                    formData[question.id] === "true"
                      ? Colors.light.primary
                      : Colors.light.border,
                }}
              >
                <Text
                  className={`${
                    formData[question.id] === "true" ? "text-white" : ""
                  }`}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleInputChange(question.id, "false")}
                className={`p-2 rounded `}
                style={{
                  backgroundColor:
                    formData[question.id] === "false"
                      ? Colors.light.primary
                      : Colors.light.border,
                }}
              >
                <Text
                  className={`${
                    formData[question.id] === "false" ? "text-white" : ""
                  }`}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
            {errors[question.id] && (
              <Text className="text-red-500 mt-1">{errors[question.id]}</Text>
            )}
          </View>
        );
      case "mcq":
        const options = (question as any).options || [
          "Option 1",
          "Option 2",
          "Option 3",
        ];
        return (
          <View className="mb-4">
            <Text className="mb-2">
              {question.question + (question.required ? " *" : "")}
            </Text>
            {options.map((option: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleInputChange(question.id, option)}
                className={`p-2 rounded mb-2 ${
                  formData[question.id] === option
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
            {errors[question.id] && (
              <Text className="text-red-500 mt-1">{errors[question.id]}</Text>
            )}
          </View>
        );
      default:
        return (
          <View className="mb-4">
            <Text className="mb-2">
              {question.question + (question.required ? " *" : "")}
            </Text>
            <TextInputComponent
              value={formData[question.id] || ""}
              onChange={(text: string) => handleInputChange(question.id, text)}
              placeholder={question.question}
            />
            {errors[question.id] && (
              <Text className="text-red-500 mt-1">{errors[question.id]}</Text>
            )}
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 container">
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestion}
        ListHeaderComponent={() => (
          <View className="flex-row items-center gap-3 my-5">
            <BackButton />
            <Text
              style={{
                fontFamily: "Poppins_Medium",
                color: Colors.light.primary,
              }}
            >
              Applying Form
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="my-5">
            <PrimaryButton onPress={handleSubmit}>Submit</PrimaryButton>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
