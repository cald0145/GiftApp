import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { FlatList, View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleContext from "../PeopleContext";
import { Ionicons } from "@expo/vector-icons";

export default function PeopleScreen() {
  const navigation = useNavigation();
  const { people } = useContext(PeopleContext);

  const renderItem = ({ item }) => {
    const dob = new Date(item.dob);
    const monthDay = dob.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
      <View style={styles.item}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.dob}>{monthDay}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Ideas", { personId: item.id })}>
          <Ionicons name="gift-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {people.length === 0 ? (
          <Text style={styles.emptyMessage}>Please add your first person</Text>
        ) : (
          <FlatList
            data={people}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddPerson")}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dob: {
    fontSize: 14,
    color: '#666',
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
