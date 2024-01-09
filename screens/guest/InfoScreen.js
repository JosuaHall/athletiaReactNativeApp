import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  Dimensions,
} from "react-native";
import Colors from "../../config/Colors";
import Icon from "../../assets/icons/athletia_logo_white.png";
import Icon2 from "../../assets/icons/HomeScreenExampleIphone.png";

import { resetPasswordResetSuccess } from "../../actions/authActions";

import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

const InfoScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const passwordResetSuccess = useSelector(
    (state) => state.auth.passwordResetSuccess
  );

  useEffect(() => {
    if (passwordResetSuccess) {
      // Show the toast for 3 seconds
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        dispatch(resetPasswordResetSuccess());
      }, 3000);
    }
  }, [passwordResetSuccess]);

  return (
    <View style={styles.container}>
      <View style={styles.containerDescription}>
        <View style={{ color: colors.text, ...styles.brandName }}>
          <Image style={styles.athletiaLogo} source={Icon} />
        </View>
        <Text style={{ ...styles.description }}>
          See who's going to sports events!{" "}
        </Text>
        <Text style={{ ...styles.description }}>
          Find out which friends are attending the upcoming football game and
          let others know which games you're going to.
        </Text>

        <View style={styles.buttonsContainer}>
          <View style={{ color: colors.text, ...styles.button }}>
            <Button
              title="Login"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
          <View style={{ color: colors.text, ...styles.button }}>
            <Button
              title="Register"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
        </View>
      </View>

      {/* Custom Toast */}
      {showToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Password Changed</Text>
        </View>
      )}

      <View style={styles.containerImage}>
        <Text style={styles.imageTitle}>
          "Sam, Alex and Emma are all going to see Thursday's football game of
          your club"
        </Text>
        <View
          style={{
            ...styles.demoContainer,
          }}
        >
          <Image style={styles.demoScreen} source={Icon2} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /** main container */
  container: {
    flexGrow: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    textAlign: "center",
    paddingVertical: 50,
    backgroundColor: Colors.blue,
  },
  /******** *********************/
  /*** container Description ***/
  containerDescription: {
    flex: 0.9,
    paddingTop: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width - 40,
  },
  athletiaLogo: {
    width: 150,
    height: 150,
  },
  brandName: {
    fontSize: 45,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  description: {
    textAlign: "center",
    fontSize: 13,
    paddingBottom: 20,
    color: "white",
    width: Dimensions.get("window").width - 40,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    padding: 10,
    flexWrap: "nowrap",
  },
  /******************************/

  /*** container Demo Example ***/
  containerImage: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
    marginBottom: 10,
    color: "white",
  },
  demoContainer: {
    alignItems: "center",
    resizeMode: "contain",
    width: Dimensions.get("window").width - 30,
  },
  demoScreen: {
    flex: 2,
    resizeMode: "contain",
    paddingTop: 550,
  },
  /**************************/
  toastContainer: {
    position: "absolute",
    top: "50%",
    left: 20,
    right: 20,
    backgroundColor: "#d7edda",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 5,
  },
  toastText: {
    color: "#406f3f",
    fontSize: 16,
    textAlign: "center",
  },
});

export default InfoScreen;
