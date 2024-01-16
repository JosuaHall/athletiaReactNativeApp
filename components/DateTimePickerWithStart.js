import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  Platform,
  View,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";

const DateTimePickerWithStart = ({ onDateTimeSelected, startDateTime }) => {
  const { colors } = useTheme();

  const [dateTime, setDateTime] = useState(moment().utc().toDate());
  const [timezone, setTimezone] = useState(moment.tz.guess());
  const [showPicker, setShowPicker] = useState(false);
  const [showTimeZonePicker, setShowTimeZonePicker] = useState(false);
  const [isDateTimeChanged, setIsDateTimeChanged] = useState(false);

  useEffect(() => {
    const convertedDateTime = moment.tz(startDateTime, timezone).toDate();

    setDateTime(convertedDateTime);
  }, []);

  const onDateSelected = (selectedDate) => {
    if (
      selectedDate !== undefined &&
      selectedDate.nativeEvent.timestamp !== undefined
    ) {
      const newDate = moment(selectedDate.nativeEvent.timestamp).utc().toDate();

      setDateTime(newDate);
      setIsDateTimeChanged(true);
      setShowPicker(false);
    }
  };

  const handleTimezoneChange = (selectedTimezone) => {
    setTimezone(selectedTimezone);
    setIsDateTimeChanged(false);
  };

  useEffect(() => {
    if (dateTime && timezone) {
      const localOffset = moment().utcOffset();
      const selectedOffset = moment.tz(dateTime, timezone).utcOffset();
      const offsetDiff = selectedOffset - localOffset;
      const formattedDateTime = moment(dateTime)
        .subtract(offsetDiff, "minutes")
        .toISOString();

      onDateTimeSelected(formattedDateTime);
    }
  }, [dateTime, timezone]);

  const getTimezoneAbbreviation = (timezoneName) => {
    const now = moment();
    const timezoneAbbreviation = now.tz(timezoneName).format("z");
    return `${timezoneName} (${timezoneAbbreviation})`;
  };

  return (
    <View>
      {!showTimeZonePicker && (
        <TouchableOpacity onPress={() => setShowTimeZonePicker(true)}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color: isDateTimeChanged ? "green" : "#0f2b8f",
                paddingVertical: 20,
                fontSize: 20,
              }}
            >
              {getTimezoneAbbreviation(timezone)}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {showTimeZonePicker && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: colors.text, textAlign: "center" }}>
            Timezone:
          </Text>
          <Picker
            selectedValue={timezone}
            onValueChange={handleTimezoneChange}
            style={{
              color: colors.text,
              width: Dimensions.get("window").width - 20,
            }}
            itemStyle={{ color: colors.text }}
          >
            {moment.tz.names().map((tz) => (
              <Picker.Item
                style={{ color: colors.text }}
                key={tz}
                label={`${tz} (${moment.tz(tz).zoneAbbr()})`}
                value={tz}
              />
            ))}
          </Picker>
          <TouchableOpacity onPress={() => setShowTimeZonePicker(false)}>
            <Text
              style={{
                color: "green",
                paddingVertical: 10,
                marginBottom: 40,
                fontSize: 25,
                textAlign: "center",
              }}
            >
              Update Timezone
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!showPicker && (
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color: isDateTimeChanged ? "green" : "#0f2b8f",
                paddingVertical: 20,
                fontSize: 20,
              }}
            >
              {moment(dateTime).format("YYYY-MM-DD HH:mm")}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {showPicker && (
        <View>
          <DateTimePicker
            textColor={colors.text}
            value={dateTime}
            mode="datetime"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            timeZoneOffsetInMinutes={moment().utcOffset()}
            onChange={onDateSelected}
          />

          <TouchableOpacity onPress={() => setShowPicker(false)}>
            <Text
              style={{
                color: "green",
                paddingVertical: 10,
                marginBottom: 40,
                fontSize: 25,
                textAlign: "center",
              }}
            >
              Update Date/Time
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DateTimePickerWithStart;
