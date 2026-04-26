import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import TasksScreen from './src/screens/TasksScreen';
import CreateTaskScreen from './src/screens/CreateTaskScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}