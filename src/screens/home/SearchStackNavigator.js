import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './search';
import StockDetails from './StockDetails';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Fontisto';
import Icon3 from 'react-native-vector-icons/Feather';
import { TouchableOpacity, View } from 'react-native';

const Stack = createStackNavigator();

const SearchStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen
        name="StockDetails"
        component={StockDetails}
        options={({ route, navigation }) => ({
          headerShown: true,
          title: route.params.symbol,
          headerStyle: {
            backgroundColor: '#FCFCFC',
          },
          headerBackImage: () => (
            <Icon3 name="arrow-left" size={25} color="#000" style={{ marginLeft: 15 }} />
          ),
          headerBackTitleVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row', color: '#000' }}>
              <TouchableOpacity
                style={{ marginRight: 24 }}
                onPress={() => {
                  route.params.handleFavorite();
                  navigation.setParams({ isFavorited: !route.params.isFavorited });
                }}
              >
                <Icon
                  name={route.params.isFavorited ? 'star' : 'staro'}
                  size={25}
                  color="#000"
                />
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
