import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  const STORAGE_KEY = "people";

  // load people from async storage
  useEffect(() => {
    const loadPeople = async () => {
      const savedPeople = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPeople) setPeople(JSON.parse(savedPeople));
    };
    loadPeople();
  }, []);

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

  const getIdeasForPerson = (personId) => {
    const person = people.find((p) => p.id === personId);
    return person ? person.ideas : [];
  };

  const addIdeaForPerson = async (personId, text, img, width, height) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        return {
          ...person,
          ideas: [
            ...person.ideas,
            { id: randomUUID(), text, img, width, height },
          ],
        };
      }
      return person;
    });
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const deleteIdeaForPerson = async (personId, ideaId) => {
    const updatedPeople = people.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          ideas: person.ideas.filter(idea => idea.id !== ideaId)
        };
      }
      return person;
    });
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

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
