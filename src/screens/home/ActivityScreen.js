import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LogoFetcher from '../components/logofetch';

const ActivityScreen = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const storedPurchases = await AsyncStorage.getItem('purchases');
      const storedSales = await AsyncStorage.getItem('sales');
      const parsedPurchases = storedPurchases ? JSON.parse(storedPurchases) : [];
      const parsedSales = storedSales ? JSON.parse(storedSales) : [];

      const combinedTransactions = [...parsedPurchases, ...parsedSales].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(combinedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => `transaction-${index}`}
        renderItem={({ item }) => {
          // Determine the sign and format the amount based on the action
          const sign = item.action === 'Buy' ? '-' : '+';
          console.log('Action:', item.action, 'Sign:', sign); // Add this line for debugging
          const formattedAmount = (item.action === 'Buy' ? '-' : '+') + '$' + Math.abs(item.quantity * item.price).toFixed(2) + ' USD';
        
          return (
            <View style={styles.transactionItem}>
              <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
              <View style={styles.stockInfo}>
                <LogoFetcher tickerSymbol={item.symbol} />
                <Text style={styles.tickerText}>{item.symbol}</Text>
                <View style={styles.sharesContainer}>
                  <Text style={styles.sharesText}>{item.action}</Text>
                  <Text style={styles.sharesTotal}>{formattedAmount}</Text>
                </View>
              </View>
            </View>
          );
        }}        
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
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#666',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  tickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  sharesContainer: {
    marginLeft: 'auto',
  },
  sharesText: {
    fontSize: 16,
    color: '#666',
  },
  sharesTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Add other styles as needed
});

export default ActivityScreen;
