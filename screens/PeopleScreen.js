import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleContext from "../PeopleContext";
import { Ionicons } from "@expo/vector-icons";
import SwipeablePersonItem from "../components/SwipeablePersonItem";
import Modal from "../components/Modal";

export default function PeopleScreen() {
  // hook for navigation
  const navigation = useNavigation();
  // get people and deletePerson function from context
  const { people, deletePerson } = useContext(PeopleContext);
  // state for modal visibility and message
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // sort people by month and then day of birth
  const sortedPeople = [...people].sort((a, b) => {
    const dateA = new Date(a.dob);
    const dateB = new Date(b.dob);
    if (dateA.getMonth() !== dateB.getMonth()) {
      return dateA.getMonth() - dateB.getMonth();
    }
    return dateA.getDate() - dateB.getDate();
  });

  // function to handle person deletion
  const handleDeletePerson = async (personId) => {
    try {
      await deletePerson(personId);
      // the list will automatically update due to the context change
    } catch (error) {
      setModalMessage("failed to delete person. please try again.");
      setModalVisible(true);
    }
  };

  // render each person item in the FlatList
  const renderItem = ({ item }) => {
    // format date of birth
    const dob = new Date(item.dob);
    const monthDay = dob.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return (
      <SwipeablePersonItem
        person={item}
        onPress={() => navigation.navigate("Ideas", { personId: item.id })}
        onDelete={() => handleDeletePerson(item.id)}
      >
        <View style={styles.item}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.dob}>{monthDay}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Ideas", { personId: item.id })}
          >
            <Ionicons name="gift-outline" size={40} color="#798071" />
          </TouchableOpacity>
        </View>
      </SwipeablePersonItem>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {sortedPeople.length === 0 ? (
          // show message if no people are added
          <Text style={styles.emptyMessage}>Add your first person!</Text>
        ) : (
          // render list of people
          <FlatList
            data={sortedPeople}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
        {/* floating action button to add new person */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddPerson")}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
        {/* modal for error messages */}
        <Modal
          visible={modalVisible}
          message={modalMessage}
          type="alert"
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8EBE4",
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B2D28",
  },
  dob: {
    fontSize: 14,
    color: "#666",
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 50,
    bottom: 40,
    backgroundColor: "#454940",
    borderRadius: 30,
    elevation: 10,
  },
});
