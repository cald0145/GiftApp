import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PeopleProvider } from "./PeopleContext";
import AppNavigator from './AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PeopleProvider>
        <AppNavigator />
      </PeopleProvider>
    </GestureHandlerRootView>
  );
}
