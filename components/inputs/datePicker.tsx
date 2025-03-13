import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import Calendar from "@/assets/icons/Calendar";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onChange: (date: string) => void;
  value: Date | null;
  label?: string;
  disabled?: boolean;
};

const DatePicker = ({ onChange, value, label, disabled }: Props) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const isDark = theme === "dark";

  const setDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      onChange(dayjs(date).toISOString());
    }
    setDatePickerOpen(false);
  };

  return (
    <View>
      <View className={`w-full`}>
        {label ? (
          <Text
            className="mb-2 font-semibold"
            style={{
              color: focused
                ? Colors[theme ?? "light"].primary
                : isDark
                ? "#E5E5E5"
                : Colors.light.text,
            }}
          >
            {label}
          </Text>
        ) : null}
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            setDatePickerOpen(true);
            setFocused(true);
          }}
          onBlur={() => setFocused(false)}
          className={`w-full text-left border rounded-xl py-4 px-5 flex-row justify-between`}
          style={{
            borderColor: focused
              ? Colors[theme ?? "light"].primary
              : isDark
              ? "#374151"
              : Colors.light.border,
            borderWidth: 2,
            backgroundColor: disabled
              ? isDark
                ? "#1F2937"
                : "#F0F5FA"
              : "transparent",
          }}
          disabled={disabled}
        >
          <Text
            style={{
              color: isDark ? "#E5E5E5" : Colors.light.text,
              fontFamily: "Poppins_Medium",
              lineHeight: 20,
            }}
          >
            {value ? dayjs(value).format("DD/MM/YYYY") : "Select Date"}
          </Text>
          <Calendar color={isDark ? "#6B7280" : Colors.light.border} />
        </TouchableOpacity>
      </View>
      {datePickerOpen ? (
        <DateTimePicker
          value={value || new Date()}
          onChange={setDate}
          maximumDate={new Date()}
          timeZoneName={"Egypt"}
        />
      ) : null}
    </View>
  );
};

export default DatePicker;
