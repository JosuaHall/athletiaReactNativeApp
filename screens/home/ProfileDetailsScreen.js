import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";

const ProfileDetailsScreen = () => {
  const { colors } = useTheme();
  const user = useSelector((state) => state.event.user_selected);

  // Function to open a social media profile using deep linking
  const openProfile = (platform, username) => {
    let deepLinkUrl = "";

    switch (platform) {
      case "instagram":
        deepLinkUrl = `instagram://user?username=${username}`;
        break;
      case "snapchat":
        deepLinkUrl = `snapchat://add/${username}`;
        break;
      case "tiktok":
        deepLinkUrl = `tiktok://user/${username}`;
        break;
      default:
        // Handle unsupported platforms or provide a fallback
        break;
    }

    if (deepLinkUrl) {
      Linking.openURL(deepLinkUrl)
        .then(() => {
          // Deep link opened successfully
        })
        .catch((err) => {
          console.error("Error opening deep link:", err);
          // Handle any errors, e.g., app not installed
        });
    } else {
      // Handle unsupported platforms or provide a fallback
    }
  };

  const insta = user.socials.find((social) => {
    return social.app === "insta" && social.username !== "";
  });
  const snap = user.socials.find((social) => {
    return social.app === "snap" && social.username !== "";
  });
  const tiktok = user.socials.find((social) => {
    return social.app === "tiktok" && social.username !== "";
  });

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: colors.card, ...styles.profileCard }}>
        {user.profileImg ? (
          <Image
            style={styles.profileImg}
            source={{
              uri: `${user.profileImg}`,
            }}
          />
        ) : (
          <View style={styles.profileImg}>
            <Ionicons name="ios-person" size={24} color={colors.text} />
          </View>
        )}
        <View style={{}}>
          <Text style={{ color: colors.text, ...styles.name }}>
            {`@${user.name}`}
          </Text>
          <Text
            style={{
              color: colors.text,
              ...styles.name,
              fontWeight: "normal",
            }}
          >
            {`${user.firstName} ${user.lastName}`}
          </Text>
        </View>
      </View>

      <Text style={{ color: colors.text, fontSize: 20, padding: 10 }}>
        Socials:
      </Text>
      {/*Check if user has any socials setup */}
      {user.socials.length === 0 ? (
        <Text style={{ color: colors.text }}>-</Text>
      ) : (
        <View style={{ flexDirection: "row" }}>
          {insta ? (
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => openProfile("instagram", insta.username)}
            >
              <Ionicons name="logo-instagram" size={50} color={colors.text} />
            </TouchableOpacity>
          ) : null}

          {tiktok ? (
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => openProfile("tiktok", tiktok.username)}
            >
              <FontAwesome5 name="tiktok" size={48} color={colors.text} />
            </TouchableOpacity>
          ) : null}

          {snap ? (
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => openProfile("snapchat", snap.username)}
            >
              <Ionicons name="logo-snapchat" size={50} color={colors.text} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
    width: Dimensions.get("window").width,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
  },
  profileCard: {
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 110,
    marginVertical: 10,
    padding: 10,
    width: Dimensions.get("window").width - 20,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: "contain",
  },
  name: {
    textAlign: "left",
    fontSize: 17,
    fontWeight: "bold",
  },
  profileImg: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderWidth: 1,
    margin: 4,
    borderColor: "grey",
    overflow: "hidden",
    marginRight: 10,
  },

  headerLabel: {
    flexDirection: "column",
    flex: 2,
    alignSelf: "center",
    justifySelf: "center",
    marginVertical: "auto",
    height: "45%",
  },
});

export default ProfileDetailsScreen;
