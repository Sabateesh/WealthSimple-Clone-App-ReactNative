import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '@rneui/themed';
import profileimg from '../../assets/profileimg.png'

const UserScreen = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState(0);
  const targetAmount = 150000;

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
          <Icon name="arrow-left" size={25} color="black" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => console.log('Settings pressed')}>
          <Icon name="settings" size={25} color="#000" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
      title: 'User Profile',
      headerStyle: {
        backgroundColor: '#F0F0F0',
      },
    });
  }, [navigation]);

  const progressPercentage = Math.min((balance / targetAmount) * 100, 100);
  const amountNeeded = Math.max(targetAmount - balance, 0).toFixed(0);


  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Sabateesh Sivakumar</Text>
      </View>
      <Image source={profileimg} style={styles.profileImage} />

      <Card containerStyle={{ marginTop: -5, borderRadius:15, backgroundColor:'#FDFDFD' }}>
        <Card.Title style={styles.title}>Your status is Core</Card.Title>
        <Text style={styles.balance}>${balance.toFixed(0)}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressInfo}>
          You need ${amountNeeded} more to reach Premium
        </Text>
        <Card.Divider />
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore Premium</Text>
        </TouchableOpacity>
      </Card>
      <Text style={styles.headerTitle2}>Your top Core benefits</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#F0F0F0'

  },
  progressBarContainer: {
    height: 15,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 30,
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#BA8857',
    borderRadius: 30,
  },
  title:{
    textAlign:'left',
    fontSize:19,
    color:'#312F2E',
    fontWeight:'700'
  },
  balance:{
    color:'#3A3837',
    fontSize:16,
    fontWeight:'700'
  },
  progressInfo:{
    paddingTop:13,
    paddingBottom:16,
    fontWeight:'300'
  },
  exploreButtonText:{
    fontWeight:'700',
    fontSize:17,
    paddingBottom:10,
    paddingTop:3
  },
  headerTitle:{
    fontWeight:'700',
    fontSize:25,
    paddingTop:25,
    paddingBottom:25,
    padding:18,
    color:'#312F2E'
  },
  headerTitle2:{
    fontWeight:'700',
    fontSize:20,
    paddingTop:25,
    paddingBottom:25,
    padding:18,
    color:'#312F2E'
  },
  scrollView:{
    backgroundColor:'#F0F0F0'
  },
  headerContainer:{
    backgroundColor:'#F0F0F0'
  },
  profileImage: {
    width: 399,
    height: 105,
    alignSelf: 'center',
  },

});

export default UserScreen;
