import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/Colors";
import { useTheme } from "@react-navigation/native";

const DropdownList = ({ options, selectedValue, onSelect }) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionPress = (option) => {
    onSelect(option);
    setIsExpanded(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={{ backgroundColor: colors.card, ...styles.dropdownButton }}
      >
        <Text style={{ color: colors.text, ...styles.dropdownButtonText }}>
          {selectedValue}
        </Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View
          style={{ backgroundColor: colors.card, ...styles.optionsContainer }}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleOptionPress(option)}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
            >
              <Text style={{ color: colors.text, ...styles.optionText }}>
                {option}
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
    width: Dimensions.get("window").width - 20,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
  },
  dropdownButtonText: {
    flex: 1,
    marginRight: 10,
  },
  optionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,

    zIndex: 100,
  },
  option: {
    position: "relative",
    padding: 10,
    zIndex: 100,
  },
  optionPressed: {
    backgroundColor: Colors.lightGrey,
  },
  optionText: {
    fontSize: 16,
    padding: 20,
  },
});

export default DropdownList;
