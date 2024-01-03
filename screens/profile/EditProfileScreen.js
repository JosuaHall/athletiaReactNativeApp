// EditProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
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
    <View style={styles.container}>
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

      <Text style={{ color: colors.text, paddingTop: 20 }}>
        Profile Visibility:
      </Text>
      <DropDownProfileSetting
        selectedValue={isPrivate}
        onSelect={handleIsPrivate}
        styling={{
          backgroundColor: colors.background,
          color: colors.text,
          paddingHorizontal: 0,
          marginHorizontal: 20,
        }}
      />

      <CreateButton
        onPress={updateProfile}
        label="Update Profile Picture"
        disabled={isButtonDisabled} // Disable the button if isButtonDisabled is true
        styling={isButtonDisabled ? styles.disabledButton : null} // Apply disabled styling if isButtonDisabled is true
      ></CreateButton>

      <DeleteButton onPress={logOut} label="Logout"></DeleteButton>

      <DeleteButton
        onPress={delAccount}
        label="Delete Account"
        styling={{ backgroundColor: "transparent" }}
        textColor={{ color: "#7F0000" }}
      ></DeleteButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center",
  },
  organizationCard: {
    flexDirection: "row",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "grey",
    overflow: "hidden",
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
  },
});

export default EditProfileScreen;
