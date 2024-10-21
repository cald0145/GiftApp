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
  // state for idea text input
  const [text, setText] = useState("");
  // state for captured image
  const [image, setImage] = useState(null);
  // state for camera facing direction
  //??????????????? NOT WORKING
  const [facing, setFacing] = useState(CameraType.back);
  // state for showing modal
  const [modalVisible, setModalVisible] = useState(false);
  // state for modal message
  const [modalMessage, setModalMessage] = useState("");

  // navigation and route hooks
  const navigation = useNavigation();
  const route = useRoute();
  // get personId from route params
  const { personId } = route.params;

  // get addIdeaForPerson function from context
  const { addIdeaForPerson } = useContext(PeopleContext);

  // get camera permissions
  const [permission, requestPermission] = useCameraPermissions();

  // calculate image dimensions
  const aspectRatio = 2 / 3;
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth * 0.6; // 60% of screen width
  const imageHeight = imageWidth * aspectRatio;

  // function to take a picture
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
        console.error("error taking picture:", error);
        setModalMessage("failed to take picture. please try again.");
        setModalVisible(true);
      }
    }
  };

  // function to save the idea
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
        setModalVisible(true);
      }
    } else {
      setModalMessage("please provide both text and image for the idea.");
      setModalVisible(true);
    }
  };

  // function to toggle camera facing
  function toggleCameraFacing() {
    setFacing((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  // if permissions are still loading, show empty view
  if (!permission) {
    return <View />;
  }

  // if permissions are not granted, show permission request
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          we need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // main component render
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        placeholder="idea description"
        value={text}
        onChangeText={setText}
      />
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>flip camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>take picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View style={styles.buttonContainer}>
        <Button title="save" onPress={saveIdea} />
        <Button
          title="cancel"
          onPress={() => navigation.navigate("Ideas", { personId })}
        />
      </View>
      <Modal
        visible={modalVisible}
        message={modalMessage}
        type="alert"
        onClose={() => setModalVisible(false)}
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
