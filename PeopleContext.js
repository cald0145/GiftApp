import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  const STORAGE_KEY = "people";

  // load people from async storage on component mount
  useEffect(() => {
    const loadPeople = async () => {
      const savedPeople = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPeople) setPeople(JSON.parse(savedPeople));
    };
    loadPeople();
  }, []);

  // add a new person to the list
  const addPerson = async (name, dob) => {
    const newPerson = {
      id: randomUUID(),
      name,
      dob: dob, // year month day format
      ideas: [],
    };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  // get ideas for a specific person
  const getIdeasForPerson = (personId) => {
    const person = people.find((p) => p.id === personId);
    return person ? person.ideas : [];
  };

  // add a new idea for a specific person
  const addIdeaForPerson = async (personId, text, imageUri, width, height) => {
    if (!text || !imageUri) {
      throw new Error("Please provide both text and image for the idea.");
    }

    const newIdea = {
      id: randomUUID(),
      text,
      img: imageUri,
      width,
      height,
    };

    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        return {
          ...person,
          ideas: [...person.ideas, newIdea],
        };
      }
      return person;
    });

    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  // delete an idea for a specific person
  const deleteIdeaForPerson = async (personId, ideaId) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        return {
          ...person,
          ideas: person.ideas.filter((idea) => idea.id !== ideaId),
        };
      }
      return person;
    });
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  // sort people by their birthday (month and day)
  const getSortedPeople = () => {
    return [...people].sort((a, b) => {
      const dateA = new Date(a.dob);
      const dateB = new Date(b.dob);
      if (dateA.getMonth() !== dateB.getMonth()) {
        return dateA.getMonth() - dateB.getMonth();
      }
      return dateA.getDate() - dateB.getDate();
    });
  };

  // provide context values to children components
  return (
    <PeopleContext.Provider
      value={{
        people,
        addPerson,
        getIdeasForPerson,
        addIdeaForPerson,
        deleteIdeaForPerson,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;
