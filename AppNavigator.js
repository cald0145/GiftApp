import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import PeopleScreen from "./screens/PeopleScreen";
import AddPersonScreen from "./screens/AddPersonScreen";
import IdeaScreen from "./screens/IdeaScreen";
import AddIdeaScreen from "./screens/AddIdeaScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E8EBE4',
          },
          headerTintColor: '#798071',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
          },
        }}
      >
        <Stack.Screen 
          name="People" 
          component={PeopleScreen}
          options={{
            title: 'Giftie',
          }}
        />
        <Stack.Screen 
          name="AddPerson" 
          component={AddPersonScreen}
          options={{
            title: 'Add A Person!',
          }}
        />
        <Stack.Screen 
          name="Ideas" 
          component={IdeaScreen}
          options={{
            title: 'Gift Ideas',
          }}
        />
        <Stack.Screen 
          name="AddIdea" 
          component={AddIdeaScreen}
          options={{
            title: 'Add An Idea!',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
