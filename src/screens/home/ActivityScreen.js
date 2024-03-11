import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LogoFetcher from '../components/logofetch';

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
      <FlatList
        data={purchases}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.purchaseItem}>
            <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
            <View style={styles.stockInfo}>
              <LogoFetcher tickerSymbol={item.symbol} />
              <Text style={styles.tickerText}>{item.symbol}</Text>
              <View style={styles.sharesContainer}>
                <Text style={styles.sharestotal}>${(item.quantity * item.price).toFixed(2)}</Text>
              </View>
            </View>
            <Text style={styles.actionText}>{item.action}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FCFCFC',
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
  dateText: {
    fontSize: 20,
    fontWeight: '500',
    paddingBottom:10,
    color: '#666',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height:50,
  },
  stockText: {
    fontSize: 16,
    marginLeft:14,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  tickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft:15,
  },
  sharesContainer: {
    marginLeft: 'auto', // Align to the right
  },
  sharesText: {
    fontSize: 16,
    marginLeft: -5, // Adjust this value to add space between ticker and shares/price
  },
  sharestotal:{
    marginTop:5,
    paddingLeft:-200,
    fontSize: 23,
    fontWeight:'bold'
  }
});

export default ActivityScreen;
