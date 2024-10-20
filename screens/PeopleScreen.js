import React, { useContext } from "react";
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

export default function PeopleScreen() {
  const navigation = useNavigation();
  // access the people array from the global context
  const { people } = useContext(PeopleContext);

  // sort people by month and then day of birth
  const sortedPeople = [...people].sort((a, b) => {
    const dateA = new Date(a.dob);
    const dateB = new Date(b.dob);
    if (dateA.getMonth() !== dateB.getMonth()) {
      return dateA.getMonth() - dateB.getMonth();
    }
    return dateA.getDate() - dateB.getDate();
  });

  // render each person item in the FlatList
  const renderItem = ({ item }) => {
    const dob = new Date(item.dob);
    const monthDay = dob.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Ideas", { personId: item.id })}
      >
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.dob}>{monthDay}</Text>
        </View>
        {/* gift icon to navigate to IdeaScreen */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Ideas", { personId: item.id })}
        >
          <Ionicons name="gift-outline" size={40} color="#798071" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {sortedPeople.length === 0 ? (
          // display message if no people are added yet
          <Text style={styles.emptyMessage}>Add your first person!</Text>
        ) : (
          // display list of people
          <FlatList
            data={sortedPeople}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
        {/* fab to add a new person */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddPerson")}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});
