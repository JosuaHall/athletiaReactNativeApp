import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({
  searchTerm,
  setFocus,
  onFocus,
  closeKeyboard,
  setSearchTerm,
  clearInputTerm,
  placeholder,
}) => {
  //const [searchTerm, setSearchTerm] = useState("");
  //const [onFocus, setFocus] = useState(false);
  const { colors } = useTheme();

  /*const clearInput = () => {
    Keyboard.dismiss();
    setSearchTerm("");
    setFocus(false);
  };*/

  return (
    <View style={styles.searchHeaderContainer}>
      <View
        style={{
          backgroundColor: colors.card,
          ...styles.searchContainer,
        }}
      >
        <Ionicons name="ios-search" size={20} color={colors.text} />
        <TextInput
          style={{ color: colors.text, ...styles.searchInput }}
          placeholder={placeholder}
          placeholderTextColor={colors.text}
          value={searchTerm}
          onPressIn={() => setFocus(!onFocus)}
          onBlur={closeKeyboard}
          onChangeText={setSearchTerm}
        />
      </View>
      {onFocus ? (
        <TouchableOpacity style={styles.button} onPress={clearInputTerm}>
          <Text
            style={{
              color: colors.text,
              ...styles.buttonLabel,
            }}
          >
            Clear
          </Text>
        </TouchableOpacity>
      ) : (
        ""
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeaderContainer: {
    flexDirection: "row",
    zIndex: 200,
    width: Dimensions.get("window").width - 30,
    alignItems: "center",
  },
  searchContainer: {
    flex: 4,
    flexDirection: "row",
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 20,
    height: "100%",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 5,
    alignItems: "center",
    height: 40,
    width: 340,
    marginVertical: 10,
  },
  buttonLabel: {
    padding: 10,
    color: "#24a0ed",
  },
});

export default SearchBar;
