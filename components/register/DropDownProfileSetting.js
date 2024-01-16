import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Colors from "./../../config/Colors";

const DROPDOWN_OPTIONS = [
  { label: "Private", value: 1 },
  { label: "Public", value: 0 },
];

const DropDownProfileSetting = ({
  selectedValue,
  onSelect,
  styling,
  listColor,
}) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionPress = (value) => {
    onSelect(value);
    setIsExpanded(false);
  };

  return (
    <View style={{ ...styles.container, ...styling }}>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: Colors.blue,
          color: colors.text,
          ...styles.dropdownButton,
          ...styling,
        }}
      >
        <Text
          style={{
            color: Colors.placeholder,
            ...styles.dropdownButtonText,
            ...styling,
          }}
        >
          {
            DROPDOWN_OPTIONS.find((option) => option.value === selectedValue)
              .label
          }
        </Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={Colors.placeholder}
          style={{ paddingRight: 5 }}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View
          style={{
            backgroundColor: "#d3d8dd",
            ...styles.optionsContainer,
            ...styling,
          }}
        >
          {DROPDOWN_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionPress(option.value)}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
            >
              <Text
                style={{
                  color: colors.text,
                  ...styles.optionText,
                  ...listColor,
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 4,
    width: Dimensions.get("window").width - 40,
    backgroundColor: Colors.blue,
    margin: 20,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#d3d8dd",
    borderRadius: 10,
  },
  dropdownButtonText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  optionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#d3d8dd",
    borderRadius: 5,
    zIndex: 100,
  },
  option: {
    position: "relative",
    padding: 10,
    zIndex: 100,
  },
  optionPressed: {
    backgroundColor: "grey",
  },
  optionText: {
    fontSize: 16,
    padding: 20,
  },
});

export default DropDownProfileSetting;
