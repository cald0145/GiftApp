import React, { useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PeopleContext from '../PeopleContext';
import { Ionicons } from '@expo/vector-icons';

export default function IdeaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params;
  const { people, getIdeasForPerson, deleteIdeaForPerson } = useContext(PeopleContext);

  const person = people.find(p => p.id === personId);
  const ideas = getIdeasForPerson(personId);

  const renderItem = ({ item }) => (
    <View style={styles.ideaItem}>
      <Image source={{ uri: item.img }} style={styles.thumbnail} />
      <Text style={styles.ideaText}>{item.text}</Text>
      <TouchableOpacity onPress={() => deleteIdeaForPerson(personId, item.id)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gift Ideas for {person.name}</Text>
      {ideas.length === 0 ? (
        <Text style={styles.emptyMessage}>No ideas yet. Add your first idea!</Text>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddIdea', { personId })}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ideaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  thumbnail: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  ideaText: {
    flex: 1,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    elevation: 8,
  },
});
