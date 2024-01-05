// UpdateInfo.js
import React from "react";
import { View, Text, Modal, StyleSheet, Button } from "react-native";

const UpdateInfo = ({ isVisible, onAcknowledge }) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>App Update Information</Text>
          {/* Add any additional information you want to display */}
          <Button title="Acknowledge Updates" onPress={onAcknowledge} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default UpdateInfo;
