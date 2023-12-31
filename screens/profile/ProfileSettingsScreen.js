import { useTheme } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import Colors from "../../config/Colors";
import InputField from "./../../components/InputField";
import { useDispatch, useSelector } from "react-redux";
import { updateSocials } from "../../actions/authActions";

const ProfileSettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const i = user.socials.find((social) => {
    return social.app === "insta";
  });
  const s = user.socials.find((social) => {
    return social.app === "snap";
  });
  const t = user.socials.find((social) => {
    return social.app === "tiktok";
  });
  const [insta, setInsta] = useState(i ? i.username : "");
  const [snap, setSnap] = useState(s ? s.username : "");
  const [tiktok, setTikTok] = useState(t ? t.username : "");

  useEffect(() => {
    const updatedSocials = [
      { app: "snap", username: snap.trim() },
      { app: "insta", username: insta.trim() },
      { app: "tiktok", username: tiktok.trim() },
    ];

    dispatch(updateSocials(updatedSocials));
  }, [snap, tiktok, insta]);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.label}>
          <Text style={{ color: colors.text }}>Instagram</Text>
        </View>
        <View
          style={{
            ...styles.input,
          }}
        >
          <Text style={{ color: colors.text }}>@</Text>
          <InputField
            styling={{
              paddingVertical: 0,
              marginVertical: 0,
              backgroundColor: colors.background,
              textAlign: "left",
              paddingLeft: 0,
            }}
            placeholder="Username"
            value={insta}
            onInput={setInsta}
          ></InputField>
        </View>
      </View>
      <View style={styles.item}>
        <View style={styles.label}>
          <Text style={{ color: colors.text }}>Snapchat</Text>
        </View>
        <View style={{ ...styles.input }}>
          <Text style={{ color: colors.text }}>@</Text>
          <InputField
            styling={{
              paddingVertical: 0,
              marginVertical: 0,
              backgroundColor: colors.background,
              textAlign: "left",
              paddingLeft: 0,
            }}
            placeholder="Username"
            value={snap}
            onInput={setSnap}
          ></InputField>
        </View>
      </View>

      <View style={styles.item}>
        <View style={styles.label}>
          <Text style={{ color: colors.text }}>TikTok</Text>
        </View>
        <View style={{ ...styles.input }}>
          <Text style={{ color: colors.text }}>@</Text>
          <InputField
            styling={{
              paddingVertical: 0,
              marginVertical: 0,
              backgroundColor: colors.background,
              textAlign: "left",
              paddingLeft: 0,
            }}
            placeholder="Username"
            value={tiktok}
            onInput={setTikTok}
          ></InputField>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.placeholder,
    borderTopWidth: 1,
    width: Dimensions.get("window").width,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    paddingHorizontal: 10,
    paddingTop: 1,
  },
  label: {
    flex: 1,
  },
  input: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    flex: 3,
    borderBottomColor: Colors.placeholder,
    borderBottomWidth: 1,
  },
});

export default ProfileSettingsScreen;
