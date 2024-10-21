import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
} from "react-native";

export default function Modal({ visible, message, type, onClose, onConfirm }) {
  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* display the message passed to the modal */}
          <Text style={styles.modalText}>{message}</Text>

          {/* if type is 'confirm', show both cancel and confirm buttons */}
          {type === "confirm" ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onConfirm}>
                <Text style={styles.buttonText}>confirm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // for other types (like 'alert'), show only an OK button
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>ok</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
