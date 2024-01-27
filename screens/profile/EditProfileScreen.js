// EditProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CreateButton from "../../components/CreateButton";
import { useSelector, useDispatch } from "react-redux";
import DeleteButton from "./../../components/DeleteButton";
import {
  logout,
  updateUserPrivacySetting,
  deleteAccount,
} from "../../actions/authActions";
import SquareImagePicker from "./../../components/SquareImagePicker";
import {
  updateProfilePicture,
  resetUpdatedSocials,
} from "./../../actions/authActions";
import DropDownProfileSetting from "../../components/register/DropDownProfileSetting";
import { Ionicons } from "@expo/vector-icons";

const EditProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [profilePic, setProfilePic] = useState({ uri: user.profileImg });
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);
  const [msg, setMsg] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Track if the button should be disabled
  const [privacyInfo, togglePrivacyInfo] = useState(false);

  useEffect(() => {
    if (profilePic.uri !== user.profileImg) {
      setIsButtonDisabled(false); // Enable the button if the profile picture has changed
    } else {
      setIsButtonDisabled(true); // Disable the button if the profile picture is the same
    }
  }, [profilePic.uri, user.profileImg]);

  useEffect(() => {
    dispatch(updateUserPrivacySetting(user._id, isPrivate));
  }, [isPrivate]);

  useEffect(() => {
    dispatch(resetUpdatedSocials());
  }, []);

  const handleImageSelected = async (asset) => {
    try {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const file = new File([blob], asset.fileName || "profilePic", {
        type: asset.type,
      });
      setProfilePic(asset);
    } catch (err) {
      console.log(err);
    }
  };

  const handleIsPrivate = (index) => {
    setIsPrivate(index);
  };

  const updateProfile = () => {
    if (profilePic.uri !== user.profileImg) {
      const profile = {
        userid: user._id,
        logo: profilePic,
      };
      dispatch(updateProfilePicture(profile));
      navigation.navigate("Profile");
    }
  };

  const logOut = () => {
    dispatch(logout());
  };

  const delAccount = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone. All your data will be removed from the app.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // The user confirmed the deletion, dispatch the action
            dispatch(deleteAccount(user._id));
          },
          style: "destructive", // This style will make the text red to indicate a destructive action
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        alginItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <SquareImagePicker
        defaultImage={profilePic.uri}
        onImageSelected={handleImageSelected}
      ></SquareImagePicker>

      <CreateButton
        onPress={updateProfile}
        label="Update Profile Picture"
        disabled={isButtonDisabled} // Disable the button if isButtonDisabled is true
        styling={isButtonDisabled ? styles.disabledButton : null} // Apply disabled styling if isButtonDisabled is true
      ></CreateButton>

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: colors.text, ...styles.header }}>
          {user.name}
        </Text>
      </View>
      <Text
        style={{ color: colors.text, ...styles.header, fontWeight: "normal" }}
      >
        {user.email}
      </Text>

      <View>
        <Text
          style={{ color: colors.text, paddingTop: 20, textAlign: "center" }}
        >
          Profile Visibility:
        </Text>

        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: 15 }}
          onPress={() => togglePrivacyInfo(!privacyInfo)}
        >
          <Ionicons
            size={25}
            name="ios-information-circle-outline"
            color="orange"
          />
        </TouchableOpacity>
      </View>

      {privacyInfo ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ff761a",
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
            position: "relative",
            width: Dimensions.get("window").width - 20,
            zIndex: 999,
          }}
        >
          <Ionicons
            size={20}
            name="ios-information-circle-outline"
            color="orange"
          />
          <Text
            style={{
              color: colors.text,
              textAlign: "left",
              paddingHorizontal: 10,
            }}
          >
            When in private mode, this will hide your profile picture from other
            users when attending an event.
          </Text>
        </View>
      ) : null}

      <DropDownProfileSetting
        selectedValue={isPrivate}
        onSelect={handleIsPrivate}
        styling={{
          backgroundColor: colors.background,
          color: colors.text,
          paddingHorizontal: 0,
          marginHorizontal: 0,
          width: "100%",
        }}
      />

      <View style={{ marginVertical: 30, paddingTop: 20 }}>
        <Text style={{ color: "#808080", textAlign: "center" }}>
          Your safety and statisfaction are our top priorities. If you have any
          concerns regarding user safety, or any other issues, please do not
          hesitate to reach out to us. Contact us at support@athletia.app for
          assistance and support.
        </Text>
      </View>

      <View style={{ marginHorizontal: Dimensions.get("window").width / 3.5 }}>
        <DeleteButton
          onPress={logOut}
          styling={{
            backgroundColor: "transparent",
            margin: 0,
            marginVertical: 20,
          }}
          textColor={{ color: "#7F0000" }}
          label="Logout"
        ></DeleteButton>

        <DeleteButton
          onPress={delAccount}
          label="Delete Account"
          styling={{
            backgroundColor: "transparent",
            margin: 0,
            marginBottom: 30,
          }}
          textColor={{ color: "#7F0000" }}
        ></DeleteButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center",
  },

  logo: {
    flex: 1,
  },
  name: {
    flex: 1,
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.2, // Adjust the opacity to make the button look disabled
    margin: 0,
  },
});

export default EditProfileScreen;
