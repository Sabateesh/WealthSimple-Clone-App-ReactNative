import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import LogoFetcher from '../components/logofetch';

const HoldingsScreen = ({ route }) => {
  const { holdings } = route.params;

  const renderHoldingItem = ({ item }) => {
    if (typeof item.currentPrice !== 'number') {
      console.error('Invalid currentPrice for symbol:', item.symbol);
      return null;
    }

    return (
    <View style={styles.container}>
        <Text style={styles.Title}>Holdings</Text>
      <View style={styles.holdingItem}>
        <LogoFetcher tickerSymbol={item.symbol} />
        <View style={styles.stockInfo}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.shares}>Shares: {item.shares}</Text>
          <Text style={styles.currentPrice}>${item.currentPrice.toFixed(2)}</Text>
        </View>
      </View>
      </View>
    );
  };

  return (
    <FlatList
      data={holdings}
      keyExtractor={(item) => item.symbol}
      renderItem={renderHoldingItem}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:100,
    backgroundColor: '#FCFCFC',
  },
  Title:{
    fontSize:22,
    fontWeight:'600',
    color:'#312F2F'
  },
  holdingItem: {
    flexDirection: 'row',
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center'
  },
  stockInfo: {
    marginLeft: 10,
    justifyContent: 'center'
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 16,
    color: '#666',
  },
  priceInfo: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  currentPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceChangeText: {
    fontSize: 14,
  },
});

export default HoldingsScreen;
