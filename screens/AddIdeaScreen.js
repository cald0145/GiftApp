import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation, useRoute } from '@react-navigation/native';
import PeopleContext from '../PeopleContext';
import Modal from '../components/Modal';

export default function AddIdeaScreen() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [cameraType, setCameraType] = useState(CameraType.back || 'back');
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params;
  const { addIdeaForPerson } = useContext(PeopleContext);

  const aspectRatio = 2/3;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth * 0.6; // 60% of screen width
  const imageHeight = imageWidth * aspectRatio;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: imageWidth, height: imageHeight } }],
          { format: 'jpeg' }
        );
        setImage(manipResult);
      } catch (error) {
        console.error('Error taking picture:', error);
        setModalMessage('Failed to take picture. Please try again.');
        setShowModal(true);
      }
    }
  };

  const saveIdea = async () => {
    if (text && image) {
      try {
        await addIdeaForPerson(personId, text, image.uri, imageWidth, imageHeight);
        navigation.navigate('Ideas', { personId });
      } catch (error) {
        console.error('Error saving idea:', error);
        setModalMessage('Failed to save idea. Please try again.');
        setShowModal(true);
      }
    } else {
      setModalMessage('Please provide both text and image for the idea.');
      setShowModal(true);
    }
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
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
      <Camera 
        style={styles.camera} 
        type={cameraType}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <Button title="Take Picture" onPress={takePicture} />
        </View>
      </Camera>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveIdea} />
        <Button title="Cancel" onPress={() => navigation.navigate('Ideas', { personId })} />
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
  camera: {
    flex: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
