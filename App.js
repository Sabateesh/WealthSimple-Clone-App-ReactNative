import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Foundation';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from "react-native-vector-icons/Fontisto";
import Icon4 from "react-native-vector-icons/FontAwesome6";
import React, { useEffect } from 'react';

import HomeScreen from './src/screens/home/Homescreen.js';
import SearchScreen from './src/screens/home/search.js';
import Transfer from './src/screens/home/transfer.js';
import Activity from './src/screens/home/ActivityScreen.js';
import SearchStackNavigator from './src/screens/home/SearchStackNavigator.js';
import * as LocalAuthentication from 'expo-local-authentication';
import Icon5 from 'react-native-vector-icons/Octicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Search') {
            iconName = 'search';
            return <Icon2 name={iconName} size={size} color={color} />;
          } else if (route.name === 'Transfer'){
            iconName = 'arrow-swap';
            return <Icon3 name={iconName} size={size} color={color} />;
          } else if (route.name === 'Activity'){
            iconName = 'clock';
            return <Icon4 name={iconName} size={size} color={color} />;
          }
        },
        headerShown: true,
        tabBarShowLabel: false,
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerTitle: "Home",
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => {}}>
          <Icon5 name="gift" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => {}}>
          <Icon2 name="user" size={25} color="#000" />
        </TouchableOpacity>
      </View>
    ),
  }}
/>

      <Tab.Screen name="Search" component={SearchStackNavigator} options={{ headerShown: false }}/>
      <Tab.Screen name="Transfer" component={Transfer} options={{ headerShown: false }}/>
      <Tab.Screen name="Activity" component={Activity} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const authenticate = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return Alert.alert('Your device is not compatible with Face ID');
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return Alert.alert('No Face ID is set up on this device.');
      }

      const { success, error } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID',
      });

      if (!success) {
        return Alert.alert('Authentication failed', error);
      }
    };

    authenticate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
