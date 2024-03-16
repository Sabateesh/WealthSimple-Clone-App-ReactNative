import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Transfer = () => {
  const options = [
    { title: 'Deposit', icon: 'bank' },
    { title: 'Transfer', icon: 'swap-horizontal' },
    { title: 'Withdraw', icon: 'cash' },
    { title: 'Automations', icon: 'repeat' },
    { title: 'Move an account to Wealthsimple', icon: 'arrow-collapse-up' },
    { title: 'Trade', icon: 'bullseye' },
    { title: 'Send or request money', icon: 'send' },
    { title: 'Pay a bill', icon: 'receipt', isNew: true },
    { title: 'Exchange CAD and USD', icon: 'currency-usd' },
  ];

  const OptionItem = ({ title, icon, isNew }) => (
    <TouchableOpacity style={styles.option}>
      <Icon name={icon} size={24} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {isNew && <View style={styles.newBadge}><Text style={styles.newText}>New</Text></View>}
      <Icon name="chevron-right" size={24} style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Move</Text>
      <ScrollView style={styles.container}></ScrollView>
      {options.map((option, index) => (
        <OptionItem key={index} {...option} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    paddingTop:50,
    paddingLeft:170
  },
  option: {
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  title: {
    flex: 1,
    fontSize: 18,
    marginLeft: 20,
    fontWeight:'700'
  },
  icon: {
    width: 30,
    textAlign: 'center',
  },
  chevron: {
    color: '#B0B0B0',
  },
  newBadge: {
    backgroundColor: '#D4EDDA',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 6,
    marginLeft:-100
  },
  newText: {
    color: '#397D54',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Transfer;
