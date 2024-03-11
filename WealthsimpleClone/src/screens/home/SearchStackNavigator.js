import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './search';
import StockDetails from './StockDetails';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Fontisto';
import { TouchableOpacity, View } from 'react-native';

const Stack = createStackNavigator();

const SearchStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen
        name="StockDetails"
        component={StockDetails}
        options={({ route }) => ({
          headerShown: true,
          title: route.params.symbol,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity  style={{ marginRight: 24 }} onPress={() => console.log('Star pressed')}>
                <Icon name="staro" size={25} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Bell pressed')} style={{ marginRight: 15 }}>
                <Icon2 name="bell" size={25} color="#000" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigator;
