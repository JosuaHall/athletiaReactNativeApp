// UpdateModal.js
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Modal, Text, View, Button, Image } from "react-native";

const UpdateModal = ({ isVisible, onClose }) => {
  const { colors } = useTheme();
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "white", padding: 20 }}>
          <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 20 }}>
            New Release - Sep. 17, 2023
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            New Feature
          </Text>
          <Text style={{ fontSize: 15, marginBottom: 10 }}>
            - Users can now link their socials to their account
          </Text>
          <Text style={{ marginBottom: 20 }}>
            - Users can view other user's social accounts
          </Text>
          <Text style={{ marginBottom: 20 }}>
            - Past events are indicated in grey
          </Text>
          <Text style={{ marginBottom: 20 }}>
            - Display more users over an event
          </Text>

          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Bug fixes resolved
          </Text>
          <Text style={{ fontSize: 15, marginBottom: 10 }}>
            - Layout of event cards (opponent name overflow)
          </Text>
          <Text style={{ fontSize: 15, marginBottom: 20 }}>
            - Event Filter layout bug, when adding team
          </Text>

          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;
