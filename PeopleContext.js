import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

// create a context for managing people and their gift ideas
const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  // state to store the list of people
  const [people, setPeople] = useState([]);

  // load people data when the component mounts
  useEffect(() => {
    loadPeople();
  }, []);

  // function to load people data from async storage
  const loadPeople = async () => {
    try {
      const storedPeople = await AsyncStorage.getItem("people");
      if (storedPeople) {
        setPeople(JSON.parse(storedPeople));
      }
    } catch (error) {
      console.error("error loading people:", error);
    }
  };

  // function to save people data to async storage
  const savePeople = async (newPeople) => {
    try {
      await AsyncStorage.setItem("people", JSON.stringify(newPeople));
      setPeople(newPeople);
    } catch (error) {
      console.error("error saving people:", error);
    }
  };

  // function to add a new person to the list
  const addPerson = (name) => {
    const newPerson = { id: randomUUID(), name, ideas: [] };
    savePeople([...people, newPerson]);
  };

  // function to add a new gift idea for a specific person
  const addIdeaForPerson = (personId, text, imageUri, width, height) => {
    const newIdea = { id: randomUUID(), text, img: imageUri, width, height };
    const updatedPeople = people.map((person) =>
      person.id === personId
        ? { ...person, ideas: [...person.ideas, newIdea] }
        : person
    );
    savePeople(updatedPeople);
  };

  // function to delete a gift idea for a specific person
  const deleteIdeaForPerson = (personId, ideaId) => {
    const updatedPeople = people.map((person) =>
      person.id === personId
        ? {
            ...person,
            ideas: person.ideas.filter((idea) => idea.id !== ideaId),
          }
        : person
    );
    savePeople(updatedPeople);
  };

  // provide the context value to child components
  return (
    <PeopleContext.Provider
      value={{
        people,
        addPerson,
        addIdeaForPerson,
        deleteIdeaForPerson,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;
