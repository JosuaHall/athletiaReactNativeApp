import React, { useState } from "react";
import { TouchableOpacity, Text, Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import { useEffect } from "react";

const YearPicker = ({ onDateTimeSelected, defaultDate }) => {
  const { colors } = useTheme();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (defaultDate) {
      const date = new Date(defaultDate);
      setDate(date);
    }
  }, []);

  const onDateSelected = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      const newDate = new Date(selectedDate);
      setDate(newDate);
      onDateTimeSelected(newDate.toISOString());
      setShowPicker(false);
    }
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <View>
      <TouchableOpacity onPress={togglePicker}>
        <View style={{ alignItems: "center" }}>
          {!showPicker ? (
            <Text style={{ color: "#0f2b8f", fontSize: 17 }}>
              {date.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          ) : (
            <Text
              style={{ color: "#0f2b8f", paddingVertical: 5, fontSize: 17 }}
            >
              Update
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          textColor={colors.text}
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateSelected}
        />
      )}
    </View>
  );
};

export default YearPicker;
