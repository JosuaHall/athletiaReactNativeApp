import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import InputField from "../../components/InputField";
import CreateButton from "./../../components/CreateButton";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const UpdateStreamLinkScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const existingStreamLink = useSelector(
    (state) => state.organization.selectedStreamLink
  );
  const [isLinkInfo, setIsLinkInfo] = useState(false);

  const toggleIsLinkInfo = () => {
    setIsLinkInfo(!isLinkInfo);
  };
  const [streamLink, setStreamLink] = useState("");

  useEffect(() => {
    setStreamLink(
      existingStreamLink !== undefined && existingStreamLink !== null
        ? existingStreamLink
        : ""
    );
  }, [existingStreamLink]);

  const handleStreamLinkChange = (text) => {
    setStreamLink(text);
    // Do any additional logic you need with the input value
  };

  const updateStreamLink = () => {
    //do something
    const stream_link = streamLink.trim();

    const fromScreen = route.params?.fromScreen ?? null;
    navigation.navigate(fromScreen, { stream_link });
  };

  return (
    <View>
      <Text style={{ color: colors.text, textAlign: "center", margin: 10 }}>
        This link will be the default for all event streams of your
        organization.
      </Text>
      <Text style={{ color: colors.text, textAlign: "center", margin: 10 }}>
        You will be able to modify this stream link individually for each event
        later on.
      </Text>
      <View style={{ padding: 10, alignItems: "center" }}>
        <TouchableOpacity
          onPress={toggleIsLinkInfo}
          style={{
            zIndex: 100,
          }}
        >
          <Ionicons
            name="ios-information-circle-outline"
            size={25}
            color="orange"
          />
        </TouchableOpacity>
      </View>
      {isLinkInfo && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ff761a",
            marginTop: 10,
            marginHorizontal: 10,
            padding: 10,
            borderRadius: 5,
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
              paddingHorizontal: 10,
            }}
          >
            Only valid URLs will work. E.g. https://www.url.com or
            http://www.url.com
          </Text>
        </View>
      )}

      <InputField
        placeholder="Enter https link: e.g. https://www.link.com"
        onInput={handleStreamLinkChange}
        value={streamLink}
        // Add any additional styles if needed
        secureTextEntry={false} // Set to true if it's a password input
      />

      <CreateButton
        styling={{ width: "100%", margin: 0, marginTop: 10 }}
        onPress={() => updateStreamLink()}
        label="Update"
      ></CreateButton>
    </View>
  );
};

const styles = StyleSheet.create({});

export default UpdateStreamLinkScreen;
