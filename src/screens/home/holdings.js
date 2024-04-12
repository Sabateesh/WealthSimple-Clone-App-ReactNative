import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoFetcher from '../components/logofetch';
import Icon from 'react-native-vector-icons/Feather';


const HoldingsScreen = ({ route }) => {
  const { holdings } = route.params;
  const [updatedHoldings, setUpdatedHoldings] = useState([]);
  const navigation = useNavigation();



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
    const cleanedSymbol = item.symbol.endsWith('.TO') ? item.symbol.replace('.TO', '') : item.symbol;


    return (
        <View style={styles.holdingItem}>
            <LogoFetcher tickerSymbol={cleanedSymbol} style={styles.logo} />
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconStyle}>
            <Icon name="arrow-left" size={30} color="#000" />
        </TouchableOpacity>
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
    backgroundColor: '#FCFCFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#312F2F',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingTop:20
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
  companyName: {
    fontSize: 18,
    color: '#504C49',
  },
  iconStyle:{
    paddingTop:70,
    paddingLeft:10,
    size:30,
  },
});

export default HoldingsScreen;
