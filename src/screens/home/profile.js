import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Fontisto';
import { MdOutlineShowChart } from "react-icons/md";


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
    <Card containerStyle={styles.benefitsCard}>
  <View style={styles.benefitItem}>
    <Icon2 name="piggy-bank-outline" size={24} color="black" />
    <Text style={styles.benefitText}>Earn 4% interest on your Cash account</Text>
  </View>
  <Text style={styles.benefitDetail}>And enjoy a 0.5% boost for direct deposit.</Text>
  
  <View style={styles.divider} />

  <View style={styles.benefitItem}>
    <Icon3 name="line-chart" size={24} color="black" />
    <Text style={styles.benefitText}>Commission-free trading</Text>
  </View>
  <Text style={styles.benefitDetail}>Plus instant deposits up to $50,000 CAD.</Text>

  <View style={styles.divider} />

  <View style={styles.benefitItem}>
    <Icon name="bar-chart-2" size={24} color="black" />
    <Text style={styles.benefitText}>Investment portfolios built by experts</Text>
  </View>
  <Text style={styles.benefitDetail}>But with management fees as low as 0.5%.</Text>
  
  <TouchableOpacity style={styles.exploreButton}>
    <Text style={styles.exploreButtonText2}>Explore all benefits</Text>
  </TouchableOpacity>
</Card>

    <Text style={styles.headerTitle3}>More</Text>

    <Card containerStyle={styles.cardContainer}>
  <View style={styles.cardHeader}>
    <Text style={styles.cardHeaderText}>USD accounts</Text>
    <View style={styles.cardHeaderStatus}>
      <Text style={styles.cardHeaderStatusText}>Active</Text>
      <Text style={styles.cardHeaderAmount}>$10/mo</Text>
      <Icon name="chevron-right" size={24} color="black" />
    </View>
  </View>
  <Text style={styles.cardSubText}>Ending Never</Text>

  <View style={styles.divider} />

  <View style={styles.cardContent}>
    <Text style={styles.cardContentText}>Support</Text>
    <Text style={styles.cardSubText2}>Talk to a real human.</Text>
    <Icon name="chevron-right" size={24} color="black" style={styles.cardChevron} />

  </View>
</Card>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FDFDFD'
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
    backgroundColor:'#FDFDFD'
  },
  headerContainer:{
    backgroundColor:'#FDFDFD'
  },
  profileImage: {
    width: 399,
    height: 105,
    alignSelf: 'center',
  },
  benefitsCard: {
    marginTop: -10,
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#FDFDFD',
    borderColor:'#FDFDFD',
  },
  benefitsTitle: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 15,
    color: '#312F2E',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight:'700',
    color: '#312F2E',
  },
  benefitDetail: {
    marginLeft: 34,
    fontSize: 16,
    color: '#625E5B',
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 0.4,
    borderBottomColor: '#ccc',
    marginTop: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  exploreButton: {
    marginTop: 10,
  },
  exploreButtonText: {
    color: '#312F2E',
    fontSize: 16,
  },
  exploreButtonText2: {
    color: '#312F2E',
    fontSize: 18,
    textAlign:'right'
  },
  headerTitle3:{
    fontWeight:'700',
    fontSize:20,
    paddingTop:25,
    paddingBottom:10,
    padding:18,
    color:'#312F2E'
  },
  cardContainer: {
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth:0.1,
    borderColor:'#FDFDFD',
    marginBottom:100
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardHeaderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderStatusText: {
    backgroundColor: '#CDEACE',
    borderRadius: 12, 
    color: '#5AAB61', 
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 30,
  },
  cardHeaderAmount: {
    fontWeight: 'bold',
    color: '#333',
    fontSize:19
  },
  cardSubText: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginTop:-10,
    fontSize: 16,
    color: '#666',
  },
  cardContent: {
    padding: 16,
  },
  cardContentText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardChevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -12, 
  },
  cardSubText2: {
    paddingBottom: 10,
    paddingTop: 10,
    fontSize: 16,
    color: '#666',
  },

});

export default UserScreen;
