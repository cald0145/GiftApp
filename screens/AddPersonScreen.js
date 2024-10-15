import React, { useContext, useState } from "react";
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import PeopleContext from "../PeopleContext";
import { useNavigation } from "@react-navigation/native";
import DatePicker from 'react-native-modern-datepicker';
import Modal from '../components/Modal'; // Assuming you've created this component

export default function AddPersonScreen() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { addPerson } = useContext(PeopleContext);
  const navigation = useNavigation();

  const savePerson = () => {
    if (name && dob) {
      addPerson(name, dob);
      navigation.goBack();
    } else {
      setModalMessage("Please provide both name and date of birth.");
      setShowModal(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <DatePicker
        onSelectedChange={date => setDob(date)}
        mode="calendar"
        style={styles.datePicker}
      />
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={savePerson} />
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
      <Modal
        visible={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  datePicker: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
