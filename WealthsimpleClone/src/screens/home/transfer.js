import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Transfer = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00a86b',
    padding: 15,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Transfer;
