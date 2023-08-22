// CreateOrganizationScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { createOrganizationWithOwner } from "./../../actions/organizationActions";
import InputField from "./../../components/InputField";
import CreateButton from "../../components/CreateButton";
import SquareImagePicker from "./../../components/SquareImagePicker";
import { Ionicons } from "@expo/vector-icons";

const CreateOrganizationScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user._id);
  const error = useSelector((state) => state.error);
  const [logo, setLogo] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [msg, setMsg] = useState("");
  const [orgNameInfo, setOrgNameInfo] = useState(false);
  const isCreated = useSelector((state) => state.organization.isCreated);

  useEffect(() => {
    if (isCreated) {
      navigation.navigate("YourOrganizations");
    }
  }, [isCreated]);

  useEffect(() => {
    // Check for failed organization creation error
    if (error.id === "ORGANIZATION_CREATION_FAIL") {
      setMsg(error.msg.msg);
    } else {
      setMsg(null);
    }
  }, [error]);

  const handleImageSelected = async (asset) => {
    try {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const file = new File([blob], asset.fileName || "logo", {
        type: asset.type,
      });
      setLogo(asset);
    } catch (err) {
      console.log(err);
    }
  };

  const addNewOrganization = (navigation) => {
    if (logo === null || orgName === null) {
      setMsg("Please enter all fields!");
    } else {
      const organization = {
        user,
        logo: logo,
        name: orgName.trim(),
      };
      dispatch(createOrganizationWithOwner(organization)); //creates Organization with owner = user
    }
  };

  const toggleOrgNameInfo = () => {
    setOrgNameInfo(!orgNameInfo);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: colors.card,
          ...styles.alert,
        }}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Ionicons
            size={20}
            name="ios-information-circle-outline"
            color="orange"
          />
        </View>
        <Text style={{ color: colors.text, ...styles.orgName }}>
          Be aware that every created Organization needs to be approved first by
          Athletia, before you will be able to use this Organization.
        </Text>
      </View>

      <Text style={{ color: colors.text, ...styles.header }}>Logo</Text>
      <SquareImagePicker
        defaultImage={logo ? logo.uri : logo}
        onImageSelected={handleImageSelected}
      ></SquareImagePicker>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            flex: 1,
            color: colors.text,
            ...styles.header,
            paddingTop: 0,
            paddingBottom: 0,
            textAlign: "center",
          }}
        >
          Organization Name
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", right: 0 }}
          onPress={toggleOrgNameInfo}
        >
          <Ionicons
            size={25}
            name="ios-information-circle-outline"
            color="orange"
          />
        </TouchableOpacity>
      </View>
      {orgNameInfo ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ff761a",
            padding: 10,
            borderRadius: 5,
            position: "absolute",
            top: "57%",
            width: Dimensions.get("window").width - 80,
            zIndex: 1,
          }}
        >
          <Ionicons
            size={20}
            name="ios-information-circle-outline"
            color="orange"
          />
          <Text
            style={{ color: colors.text, textAlign: "left", paddingLeft: 10 }}
          >
            This will be the name of your Organization showing within the app
          </Text>
        </View>
      ) : null}

      <InputField
        onInput={setOrgName}
        value={orgName}
        placeholder="Enter Organization Name.."
      ></InputField>

      {msg ? (
        <View
          style={{
            ...styles.alert,
            width: "100%",
            backgroundColor: "#d0342c",
          }}
        >
          <Text
            style={{
              color: colors.text,
            }}
          >
            {msg}
          </Text>
        </View>
      ) : null}

      <CreateButton
        onPress={() => addNewOrganization(navigation)}
        label="Create"
      ></CreateButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 10,
  },
  alert: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#ff761a",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  organizationCard: {
    flexDirection: "row",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  logo: {
    flex: 1,
    textAlign: "center",
    resizeMode: "contain",
  },
  name: {
    flex: 1,
    textAlign: "center",
  },
  alertCard: {
    padding: 10,
  },
});

export default CreateOrganizationScreen;
