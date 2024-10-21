import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import PeopleContext from "../PeopleContext";
import { Ionicons } from "@expo/vector-icons";

export default function IdeaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params;
  const { people, getIdeasForPerson, deleteIdeaForPerson } =
    useContext(PeopleContext);
  const [ideas, setIdeas] = useState([]);

  // find the person based on the personId
  const person = people.find((p) => p.id === personId);

  // load ideas when the component mounts or personId changes
  useEffect(() => {
    loadIdeas();
  }, [personId]);

  // fetch ideas for the current person
  const loadIdeas = () => {
    const loadedIdeas = getIdeasForPerson(personId);
    setIdeas(loadedIdeas);
  };

  // handle deletion of an idea
  const handleDelete = async (ideaId) => {
    Alert.alert("Delete Idea", "Are you sure you want to delete this idea?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await deleteIdeaForPerson(personId, ideaId);
          loadIdeas(); // reload ideas after deletion
        },
      },
    ]);
  };

  // render individual idea item
  const renderItem = ({ item }) => {
    const aspectRatio = item.width / item.height;
    const thumbnailWidth = 50;
    const thumbnailHeight = thumbnailWidth / aspectRatio;

    return (
      <View style={styles.ideaItem}>
        <Image
          source={{ uri: item.img }}
          style={[
            styles.thumbnail,
            { width: thumbnailWidth, height: thumbnailHeight },
          ]}
        />
        <Text style={styles.ideaText}>{item.text}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={30} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gift Ideas for {person.name}!</Text>
      {ideas.length === 0 ? (
        // display message when no ideas are present
        <Text style={styles.emptyMessage}>
          Dang! No ideas yet. Add your first idea!
        </Text>
      ) : (
        // display list of ideas
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      {/* floating action button to add new idea */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddIdea", { personId })}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8EBE4",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#454940",
    textAlign: "center",
  },
  ideaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F2F4F0",
    padding: 10,
    borderRadius: 10,
  },
  thumbnail: {
    marginRight: 10,
    borderRadius: 5,
  },
  ideaText: {
    flex: 1,
    color: "#454940",
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#666",
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
