import React, { useState } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAcknowledgement } from "../actions/authActions";

const SquareImagePicker = ({ defaultImage, onImageSelected }) => {
  const { colors } = useTheme();
  const [image, setImage] = useState(defaultImage);
  const [isLoading, setIsLoading] = useState(false);
  const userid = useSelector((state) => state.auth.user._id);
  const acknowledgement = useSelector(
    (state) => state.auth.user.acknowlegement
  );
  const dispatch = useDispatch();

  const pickImage = async () => {
    acknowledgement ? null : showAlert();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
    });

    if (!result.canceled) {
      setIsLoading(true); // Set loading state to true

      const selectedAsset = {
        ...result.assets[0],
        uri: `data:${result.assets[0].type};base64,${result.assets[0].base64}`,
      };

      let asset = { ...selectedAsset };

      if (selectedAsset.width > 300 || selectedAsset.height > 300) {
        const manipResult = await ImageManipulator.manipulateAsync(
          selectedAsset.uri,
          [{ resize: { width: 300, height: 300 } }],
          { format: "jpeg", base64: true }
        );

        asset = {
          ...selectedAsset,
          uri: `data:${result.assets[0].type};base64,${manipResult.base64}`,
          base64: manipResult.base64,
          height: manipResult.height,
          width: manipResult.width,
        };
      }

      setImage(asset.uri);
      onImageSelected(asset);

      setIsLoading(false); // Set loading state to false after processing is complete
    }
  };

  const showAlert = async () => {
    Alert.alert(
      "Important",
      "By using the platform, you are responsible for all content you upload, including photos, text, and media. This content must adhere to local, state, and national laws. Prohibited content includes nudity, explicit material, offensive info, illegal activities, copyrighted materia, personal data, misleading info, violence, child exploitation, harassment, and false representations. The platform may take action against violating content.",
      [
        {
          text: "OK",
          onPress: () => dispatch(updateUserAcknowledgement(userid)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        {isLoading ? (
          <Text style={{ color: colors.text }}>laoding</Text>
        ) : image ? (
          <Image source={{ uri: `${image}` }} style={styles.image} />
        ) : (
          <View style={{ backgroundColor: colors.card, ...styles.placeholder }}>
            <Text style={{ color: colors.text, ...styles.placeholderText }}>
              +
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 100,
    overflow: "hidden",
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: "contain",
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 20,
  },
});

export default SquareImagePicker;
