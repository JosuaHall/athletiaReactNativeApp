import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const ShareScreen = ({ route }) => {
  const { colors } = useTheme();
  const { url } = route.params;

  const handleSharing = async () => {
    try {
      if (url) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync("file://" + url, {
            UTI: Platform.OS === "ios" ? "public.image" : undefined, // Uniform Type Identifier
            // Additional options as needed (refer to documentation)
          });
        } else {
          console.error("Sharing is not available on this device.");
        }
      } else {
        console.error("No screenshot captured.");
      }
    } catch (error) {
      console.error("Error sharing screenshot:", error);
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Image
        source={{ uri: url }}
        style={{
          ...styles.previewImage,
          borderColor: colors.text,
          padding: 20,
        }}
      />
      <TouchableOpacity onPress={handleSharing}>
        <View style={styles.shareButton}>
          <Text style={{ color: "white", fontSize: 20 }}>Share</Text>
          <Ionicons name="ios-arrow-redo-outline" size={30} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "75%",
    height: "75%",
    padding: 10,
    borderRadius: 20,
    margin: 20,
    borderWidth: 5,
  },
  shareButton: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#3296f8",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: 200,
  },
});

export default ShareScreen;
