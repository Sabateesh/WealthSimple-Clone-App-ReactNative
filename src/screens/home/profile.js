import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';



const UserScreen = () => {
    const navigation = useNavigation();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const loadBalance = async () => {
          try {
            const storedBalance = await AsyncStorage.getItem('balance');
            if (storedBalance) {
              setBalance(parseFloat(storedBalance));
            }
          } catch (error) {
            console.error('Failed to load balance:', error);
          }
        };
    
        loadBalance();
    }, []);

  
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} color="black" />
          </TouchableOpacity>        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log('Settings pressed')}>
            <Icon name="settings" size={25} color="#000" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ),
        title: 'User Profile',
      });
    }, [navigation]);
  


  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Sabateesh Sivakumar</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>Your status is Core</Text>
        <Text>${balance.toFixed(2)}</Text>
        <Text style={styles.progressInfo}>
          You need $87,704 more to reach Premium
        </Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore Premium</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserScreen;
