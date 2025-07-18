import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/buttons/backButton";
import TextInputComponent from "@/components/inputs/textInput";
import { Colors } from "@/constants/Colors";
import { Question } from "@/constants/types";
import { get, post } from "@/hooks/axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import PrimaryButton from "@/components/buttons/primary";
import uploadFile, { deleteFile } from "@/utils/uploadFile";
import { useTheme } from "@/context/ThemeContext";
import { useLoading } from "@/context/LoadingContext";

export default function Application() {
  const { id } = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { showLoading, hideLoading } = useLoading();
  const getQuestions = useCallback(async () => {
    try {
      showLoading();
      const res = await get("programs/getProgramQuestions/" + id);
      setQuestions(res.data.data);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    } finally {
      hideLoading();
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

  const [fileUploading, setFileUploading] = useState<{
    [key: string]: boolean;
  }>({});

  const handleFilePick = async (questionId: string) => {
    setFileUploading((prev) => ({ ...prev, [questionId]: true }));
    const result = await DocumentPicker.getDocumentAsync({
      type:
        questions.find((q) => q.id === questionId)?.fileFormat?.length === 0
          ? ["image/*", "application/pdf"]
          : questions.find((q) => q.id === questionId)?.fileFormat,
    });

    if (!result.canceled) {
      try {
        // showLoading();
        const file = result.assets[0];
        const fileExtension = file.mimeType?.includes("pdf") ? "pdf" : "png";
        const uploadResult = await uploadFile(
          file.uri,
          file.mimeType || "image/png",
          `${questionId}.${fileExtension}`
        );

        // Save uploaded file URL/path immediately
        handleInputChange(questionId, uploadResult);
      } catch (error) {
        console.error("Upload failed:", error);
        Alert.alert("Upload Error", "Failed to upload file.");
      } finally {
        setFileUploading((prev) => ({ ...prev, [questionId]: false }));
        // hideLoading();
      }
    } else {
      setFileUploading((prev) => ({ ...prev, [questionId]: false }));
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

    questions.forEach((question) => {
      const answer = formData[question.id];
      if (answer) {
        application.push({ questionId: question.id, answer });
      }
    });

    return application;
  };

  const router = useRouter();

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }
    try {
      setLoading(true);
      showLoading();
      const realFormData = await buildRealFormData();
      await post("programs/submitApplication/" + id, {
        questions: realFormData,
      }).then(() => {
        router.replace(`/program/${id}/submitSuccess`);
      });
    } catch (error) {
      console.error("Error submitting application: ", error);
      Alert.alert("Error", "There was an error submitting your application.");
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  // Add state for dropdown modal
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [activeOptions, setActiveOptions] = useState<string[]>([]);

  // Function to open dropdown
  const openDropdown = (questionId: string, options: string[]) => {
    setActiveQuestionId(questionId);
    setActiveOptions(options);
    setDropdownVisible(true);
  };

  // Function to select an option from dropdown
  const selectOption = (option: string) => {
    if (activeQuestionId) {
      handleInputChange(activeQuestionId, option);
    }
    setDropdownVisible(false);
  };

  const handleDeleteFile = async (questionId: string) => {
    const uri = formData[questionId];
    handleInputChange(questionId, "");
    await deleteFile(uri);
  };

  // Disable submit if any file is uploading
  const isAnyFileUploading = Object.values(fileUploading).some(Boolean);

  // Render a single question based on its type
  const renderQuestion = ({ item: question }: { item: Question }) => {
    switch (question.type) {
      case "complete":
        return (
          <View className="mb-4">
            <Text className="mb-2 dark:text-white">
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
            <Text className="mb-2 dark:text-white">
              {question.question + (question.required ? " *" : "")}
            </Text>
            <View className="flex flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleFilePick(question.id)}
                className="flex-1 border border-gray-300 p-3 rounded-lg"
                disabled={!!formData[question.id] || !!fileUploading[question.id]}
                style={{
                  opacity:
                    !!formData[question.id] || fileUploading[question.id]
                      ? 0.6
                      : 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {fileUploading[question.id] ? (
                  <>
                    <Text className="dark:text-white mr-2">Uploading...</Text>
                    <ActivityIndicator
                      size="small"
                      color={Colors.light.primary}
                    />
                  </>
                ) : (
                  <Text className="dark:text-white">
                    {formData[question.id] ? "File Selected" : "Select File"}
                  </Text>
                )}
              </TouchableOpacity>
              {formData[question.id] && !fileUploading[question.id] && (
                <TouchableOpacity
                  onPress={() => handleDeleteFile(question.id)}
                  className="flex justify-center items-center bg-red-500 rounded-lg px-4"
                >
                  <Text className="text-white text-center text-2xl">x</Text>
                </TouchableOpacity>
              )}
            </View>
            {errors[question.id] && (
              <Text className="text-red-500 mt-1">{errors[question.id]}</Text>
            )}
          </View>
        );
      case "rightWrong":
        return (
          <View className="mb-4">
            <Text className="mb-2 dark:text-white">
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
            <Text className="mb-2 dark:text-white">
              {question.question + (question.required ? " *" : "")}
            </Text>
            <TouchableOpacity
              onPress={() => openDropdown(question.id, options)}
              className="border border-gray-300 p-3 rounded-lg"
              style={{
                backgroundColor: isDark
                  ? Colors.dark.border
                  : Colors.light.border,
              }}
            >
              <Text className="dark:text-white">
                {formData[question.id] || "Select an option"}
              </Text>
            </TouchableOpacity>
            {errors[question.id] && (
              <Text className="text-red-500 mt-1">{errors[question.id]}</Text>
            )}
          </View>
        );
      default:
        return (
          <View className="mb-4">
            <Text className="mb-2 dark:text-white">
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
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <View className="container">
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
                  color: Colors[theme ?? "light"].primary,
                }}
              >
                Applying Form
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="my-5">
              <PrimaryButton
                onPress={handleSubmit}
                disabled={loading || isAnyFileUploading}
              >
                Submit
              </PrimaryButton>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: isDark
                ? Colors.dark.background
                : Colors.light.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "60%",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_Medium",
                fontSize: 18,
                marginBottom: 15,
                color: isDark ? "white" : "black",
              }}
            >
              Select an option
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {activeOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectOption(option)}
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark
                      ? Colors.dark.border
                      : Colors.light.border,
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? "white" : "black",
                      fontSize: 16,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
