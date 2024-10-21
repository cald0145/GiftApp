import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation, useRoute } from "@react-navigation/native";
import PeopleContext from "../PeopleContext";
import Modal from "../components/Modal";

export default function AddIdeaScreen() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params;
  const { addIdeaForPerson } = useContext(PeopleContext);
  const [permission, requestPermission] = useCameraPermissions();

  const aspectRatio = 2 / 3;
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth * 0.6; // 60% of screen width
  const imageHeight = imageWidth * aspectRatio;

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: imageWidth, height: imageHeight } }],
          { format: "jpeg" }
        );
        setImage(manipResult);
      } catch (error) {
        console.error("Error taking picture:", error);
        setModalMessage("Failed to take picture. Please try again.");
        setShowModal(true);
      }
    }
  };

  const saveIdea = async () => {
    if (text && image) {
      try {
        await addIdeaForPerson(
          personId,
          text,
          image.uri,
          imageWidth,
          imageHeight
        );
        navigation.navigate("Ideas", { personId });
      } catch (error) {
        setModalMessage(error.message);
        setShowModal(true);
      }
    } else {
      setModalMessage("Please provide both text and image for the idea.");
      setShowModal(true);
    }
  };

  function toggleCameraFacing() {
    setFacing((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        placeholder="Idea description"
        value={text}
        onChangeText={setText}
      />
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveIdea} />
        <Button
          title="Cancel"
          onPress={() => navigation.navigate("Ideas", { personId })}
        />
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
    backgroundColor: "#E8EBE4",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  camera: {
    flex: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    margin: 20,
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
