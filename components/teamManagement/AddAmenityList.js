import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import AddButton from "./../AddButton";
import { useSelector } from "react-redux";

const AddAmenityList = ({ updateAmenities }) => {
  const [amenity, setAmenity] = useState("");
  const [amenitiesList, setAmenitiesList] = useState([]);
  const event_selected = useSelector((state) => state.event.event_selected);
  const { colors } = useTheme();

  useEffect(() => {
    if (event_selected) setAmenitiesList(event_selected.amenities);
  }, []);

  const handleAddAmenity = () => {
    if (amenity.trim()) {
      setAmenitiesList([...amenitiesList, amenity]);
      updateAmenities([...amenitiesList, amenity]);
      setAmenity("");
    }
  };

  const handleDeleteAmenity = (index) => {
    const updatedList = [...amenitiesList];
    updatedList.splice(index, 1);
    setAmenitiesList(updatedList);
    updateAmenities(updatedList);
  };

  const handleInputText = (text) => {
    setAmenity(text);
  };

  return (
    <View style={styles.container}>
      <View style={{ color: colors.text, ...styles.inputContainer }}>
        <TextInput
          style={{
            ...styles.textInput,
            color: colors.text,
            backgroundColor: colors.card,
          }}
          placeholder="e.g. Halftime Show"
          placeholderTextColor="grey"
          onChangeText={handleInputText}
          value={amenity}
        />
        <AddButton onPress={handleAddAmenity} />
      </View>
      <View>
        {amenitiesList.map((item, index) => (
          <View
            key={index}
            style={{ backgroundColor: colors.card, ...styles.listItem }}
          >
            <TextInput
              style={{ color: colors.text, ...styles.listItemText }}
              editable={false}
              value={item}
            />
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => handleDeleteAmenity(index)}
            >
              <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width - 70,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  textInput: {
    borderRadius: 5,
    width: Dimensions.get("window").width - 150,
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 1,
    marginRight: 5,
  },
  listItem: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  listItemText: {
    fontSize: 15,
  },
  button: {},
});

export default AddAmenityList;
