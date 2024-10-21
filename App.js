import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator.js";
import { PeopleProvider } from "./PeopleContext";

export default function App() {
  return (
    <PeopleProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PeopleProvider>
  );
}
