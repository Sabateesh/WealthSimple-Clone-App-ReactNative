import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import LogoFetcher from '../components/logofetch';

const HoldingsScreen = ({ route }) => {
  const { holdings } = route.params;
  const [updatedHoldings, setUpdatedHoldings] = useState([]);



  useEffect(() => {
    const fetchCompanyNames = async () => {
      const updatedHoldingsWithNames = await Promise.all(
        holdings.map(async (holding) => {
          const response = await fetch(`http://127.0.0.1:5000/company_info?symbol=${holding.symbol}`);
          const data = await response.json();
          return { ...holding, companyName: data.name, currency: data.currency };
        })
      );
      setUpdatedHoldings(updatedHoldingsWithNames);
    };

    fetchCompanyNames();
  }, [holdings]);


  const renderHoldingItem = ({ item }) => {
    if (typeof item.currentPrice !== 'number') {
        console.error('Invalid currentPrice for symbol:', item.symbol);
        return null;
    }

    return (
        <View style={styles.holdingItem}>
            <LogoFetcher tickerSymbol={item.symbol} style={styles.logo} />
            <View style={styles.stockInfo}>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.companyName}>{item.companyName}</Text>
            </View>
            <View style={styles.priceInfo}>
                <Text style={styles.currentPrice}>${item.currentPrice.toFixed(2)} {item.currency}</Text>
                <Text style={styles.shares}>Shares: {item.shares}</Text>
            </View>
        </View>
    );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Holdings</Text>
      <FlatList
        data={updatedHoldings}
        keyExtractor={(item) => item.symbol}
        renderItem={renderHoldingItem}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#FCFCFC',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#312F2F',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  holdingItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockInfo: {
    flex: 1,
    marginLeft: 10,
  },
  symbol: {
    fontSize: 22,
    fontWeight: 'bold',
    color:'#312F2E',
    paddingBottom:10
  },
  shares: {    
    fontSize: 18,
    color: '#666',
    marginLeft:25
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
    color:'#312F2E',
    paddingBottom:5
  },
  logo: {
    // Style for the logo, if needed
  },
  list: {
    // Any additional styling for the list, if needed
  },
  companyName: {
    fontSize: 18,
    color: '#504C49',

  },
});

export default HoldingsScreen;
