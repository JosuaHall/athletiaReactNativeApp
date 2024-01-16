// EditProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
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

const EditProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [profilePic, setProfilePic] = useState({ uri: user.profileImg });
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);
  const [msg, setMsg] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Track if the button should be disabled

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

      <Text style={{ color: colors.text, ...styles.header }}>{user.name}</Text>
      <Text
        style={{ color: colors.text, ...styles.header, fontWeight: "normal" }}
      >
        {user.email}
      </Text>

      <Text style={{ color: colors.text, paddingTop: 20, textAlign: "center" }}>
        Profile Visibility:
      </Text>
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

      <CreateButton
        onPress={updateProfile}
        label="Update Profile Picture"
        disabled={isButtonDisabled} // Disable the button if isButtonDisabled is true
        styling={isButtonDisabled ? styles.disabledButton : null} // Apply disabled styling if isButtonDisabled is true
      ></CreateButton>

      <DeleteButton
        onPress={logOut}
        styling={{ margin: 0, marginVertical: 20 }}
        label="Logout"
      ></DeleteButton>

      <View style={{ marginVertical: 10 }}>
        <Text style={{ color: "#aaa", textAlign: "center" }}>
          Your safety and statisfaction are our top priorities. If you have any
          concerns regarding user safety, or any other issues, please do not
          hesitate to reach out to us. Contact us at support@athletia.app for
          assistance and support.
        </Text>
      </View>

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
