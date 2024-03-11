import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SearchScreen from './SearchScreen';
import StockDetails from './StockDetails';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="StockDetails" component={StockDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
