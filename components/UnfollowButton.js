import React, { Fragment, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const UnfollowButton = ({ onPress, label, styling }) => {
  const { colors } = useTheme();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleUnfollow = () => {
    handleDropdownToggle();
    onPress();
  };

  return (
    <Fragment>
      <TouchableOpacity
        onPress={handleDropdownToggle}
        style={{
          backgroundColor: colors.card,
          ...styles.createButton,
          ...styling,
        }}
      >
        <Text style={{ color: "#3296f8" }}>{label}</Text>
        <Ionicons
          name="caret-down"
          size={15}
          color={"#3296f8"}
          style={styles.dropdownButton}
        ></Ionicons>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View
          style={{
            ...styles.dropdown,
            borderColor: colors.card,
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity onPress={handleUnfollow}>
            <Text style={{ color: colors.text, ...styles.dropdownItem }}>
              Unfollow
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    borderColor: "#3296f8",
    borderWidth: 1,
  },
  dropdownButton: {
    paddingLeft: 0,
  },
  dropdown: {
    position: "absolute",
    top: 81,
    right: 20,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 1000,
    backgroundColor: "white", // Change the opacity to control the blur effect
    blurRadius: 10, // Change the blur radius to control the amount of blur
  },
  dropdownItem: {
    padding: 15,
    color: "#3296f8",
  },
});

export default UnfollowButton;
