import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const AddHeadTeamAdmin = ({ navigation }) => {
  const { colors } = useTheme();
  const userId = useSelector((state) => state.auth.user._id);
  const orgId = useSelector((state) => state.organization.selected.owner);
  const [headAdminInfoVisible, setHeadAdminInfoVisible] = useState(false);

  const toggleHeadAdminInfo = () => {
    setHeadAdminInfoVisible(!headAdminInfoVisible);
  };

  const openAddHeadTeamAdmin = (navigation) => {
    navigation.navigate("AddHeadAdmin");
  };
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={{ color: colors.text, ...styles.heading }}>
          Head Admin
        </Text>
        {userId === orgId ? (
          <TouchableOpacity
            onPress={() => openAddHeadTeamAdmin(navigation)}
            style={{ backgroundColor: colors.card, ...styles.addButton }}
          >
            <Text style={{ color: colors.primary }}>+</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={toggleHeadAdminInfo}
          style={{
            right: -40,
          }}
        >
          <Ionicons
            name="ios-information-circle-outline"
            size={25}
            color="orange"
          />
        </TouchableOpacity>
      </View>
      {headAdminInfoVisible && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ff761a",
            padding: 10,
            borderRadius: 5,
            width: Dimensions.get("window").width - 60,
            zIndex: 1,
          }}
        >
          <Ionicons
            name="ios-information-circle-outline"
            size={20}
            color="orange"
          />
          <Text
            style={{
              color: "black",
              ...styles.infoText,
              paddingHorizontal: 10,
            }}
          >
            Head Admins can manage other Team Admins and the Events of this team
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    padding: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});

export default AddHeadTeamAdmin;
