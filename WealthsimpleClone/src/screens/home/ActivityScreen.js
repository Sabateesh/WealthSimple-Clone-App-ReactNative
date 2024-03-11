import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ActivityScreen = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const storedPurchases = await AsyncStorage.getItem('purchases');
        const parsedPurchases = storedPurchases ? JSON.parse(storedPurchases) : [];
        setPurchases(parsedPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };

    fetchPurchases();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPurchases = async () => {
        try {
          const storedPurchases = await AsyncStorage.getItem('purchases');
          const parsedPurchases = storedPurchases ? JSON.parse(storedPurchases) : [];
          setPurchases(parsedPurchases);
        } catch (error) {
          console.error('Error fetching purchases:', error);
        }
      };
  
      fetchPurchases();
    }, [])
  );
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Purchases</Text>
      <FlatList
        data={purchases}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.purchaseItem}>
            <Text style={styles.purchaseText}>{item.symbol} - ${item.price.toFixed(2)} - {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  purchaseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  purchaseText: {
    fontSize: 16,
  },
});

export default ActivityScreen;
