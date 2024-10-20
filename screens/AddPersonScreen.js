import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import PeopleContext from "../PeopleContext";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-modern-datepicker";
import Modal from "../components/Modal";

export default function AddPersonScreen() {
  // state variables for form inputs and modal
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // access the addPerson function from context
  const { addPerson } = useContext(PeopleContext);
  const navigation = useNavigation();

  const savePerson = async () => {
    if (name && dob) {
      try {
        // convert the date string to year month day format
        const formattedDob = dob.split("/").reverse().join("-");
        await addPerson(name, formattedDob);
        navigation.goBack(); // Return to PeopleScreen on success
      } catch (error) {
        // show error modal if save fails
        setModalMessage("Sorry! Failed to save the person. Please try again!");
        setShowModal(true);
      }
    } else {
      // show error modal if name or dob is missing
      setModalMessage("Oops! Please provide both name and date of birth!");
      setShowModal(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* name input */}
        <KeyboardAvoidingView behavior="padding">
          <TextInput
            style={styles.input}
            placeholder="Enter your friend's name!"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#666"
          />
        </KeyboardAvoidingView>

        {/* date picker */}
        <KeyboardAvoidingView behavior="padding">
          <DatePicker
            onSelectedChange={(date) => setDob(date)}
            mode="calendar"
            options={{
              backgroundColor: '#F2F4F0',
              textHeaderColor: '#454940',
              textDefaultColor: '#454940',
              selectedTextColor: '#fff',
              mainColor: '#879772',
              textSecondaryColor: '#454940',
              borderColor: 'rgba(122, 146, 165, 0.1)',
            }}
            style={{ borderRadius: 20, marginBottom: 20 }}
          />
        </KeyboardAvoidingView>

        {/* save and cancel buttons */}
        <KeyboardAvoidingView behavior="padding" style={styles.buttonContainer}>
          <Button title="Save" onPress={savePerson} color="#798071" />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            color="#798071"
          />
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>

      {/* modal for displaying error messages */}
      <Modal
        visible={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8EBE4",
    flexGrow: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
