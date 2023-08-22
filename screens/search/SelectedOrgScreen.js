// SelectedOrgScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import EventSliderNoSocial from "../../components/search/EventSliderNoSocial";
import { ScrollView } from "react-native-gesture-handler";
import OrganizationHeader from "../../components/search/OrganizationHeader";

const SelectedOrgScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <ScrollView>
      <View style={{ color: colors.text, ...styles.container }}>
        <OrganizationHeader></OrganizationHeader>
        <EventSliderNoSocial navigation={navigation}></EventSliderNoSocial>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectedOrgScreen;
