import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Colors } from "@/constants/Colors";
import Calendar from "@/assets/icons/Calendar";

type Props = {
  onChange: (date: string) => void;
  value: Date | null;
  label?: string;
  disabled?: boolean;
};

const DatePicker = ({ onChange, value, label, disabled }: Props) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const colorScheme = useColorScheme();

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
              color: Colors[colorScheme ?? "light"].text,
            }}
          >
            {label}
          </Text>
        ) : null}
      </View>
      <View>
        <TouchableOpacity
          onPress={() => setDatePickerOpen(true)}
          className={`w-full text-left border rounded-xl py-4 px-5 flex-row justify-between`}
          style={{
            borderColor: Colors[colorScheme ?? "light"].border,
            borderWidth: 2,
            backgroundColor: disabled ? "#F0F5FA" : "transparent",
          }}
          disabled={disabled}
        >
          <Text
            style={{
              color: Colors[colorScheme ?? "light"].text,
              fontFamily: "Poppins_Medium",
              lineHeight: 20,
            }}
          >
            {value ? dayjs(value).format("DD/MM/YYYY") : "Select Date"}
          </Text>
          <Calendar />
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
