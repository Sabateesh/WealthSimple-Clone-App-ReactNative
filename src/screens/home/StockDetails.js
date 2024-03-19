import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Button, Alert,TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoFetcher from '../components/logofetch';
import Dialog from 'react-native-dialog';
import StockChart from '../components/stockchart';

const StockDetails = ({ route }) => {
  const { symbol } = route.params;
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(100000);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [numberOfShares, setNumberOfShares] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/stock_price?symbol=${symbol}`);
        const data = await response.json();
        let quote = data.quote;

        const keysToInclude = ["Bid", "Ask", "Open", "Previous Close", "Earnings Date", "Market Cap", "PE Ratio (TTM)", "Volume", "Day's Range", "Forward Dividend & Yield"];

        let filteredQuote = {};
        keysToInclude.forEach(key => {
          if (quote[key] !== undefined) {
            filteredQuote[key] = quote[key];
          }
        });

        setStockData({
          ...data,
          quote: filteredQuote
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);
  const handleBuy = async () => {
    const now = new Date()
    const dayofweek = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    //check if market open else don't fulfill order
    //for testing commenting out for now
   //if (dayofweek >= 1 && dayofweek <= 5 && (hour > 9 || (hour === 9 && minute >= 30)) && hour < 16) {
    Alert.prompt(
        'Buy Shares',
        `Enter the number of shares you want to buy for ${symbol} at $${stockData.price.toFixed(2)} each`,
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Buy',
                onPress: async (numberOfShares) => {
                  const totalCost = numberOfShares * stockData.price;
                  if (totalCost > balance) {
                      Alert.alert('Insufficient Funds', `You do not have enough funds to purchase ${numberOfShares} shares of ${symbol}.`);
                      return;
                  }

                  const newBalance = balance - totalCost;
                  await AsyncStorage.setItem('balance', newBalance.toString());
                  setBalance(newBalance);

                  console.log(`Buying ${numberOfShares} shares at $${stockData.price.toFixed(2)} each`);
                  console.log(`Total cost of purchase: $${totalCost.toFixed(2)}`);
                  console.log(`Old balance: $${balance.toFixed(2)}`);
                  console.log(`New balance: $${newBalance.toFixed(2)}`);

                  const purchase = {
                      symbol: symbol,
                      price: stockData.price,
                      date: new Date(),
                      quantity: numberOfShares,
                      totalCost: totalCost
                  };

                  try {
                      const portfolio = await AsyncStorage.getItem('portfolio');
                      const userPortfolio = portfolio ? JSON.parse(portfolio) : {};
                      const newPortfolio = {...userPortfolio, [symbol]: (userPortfolio[symbol] || 0) + parseInt(numberOfShares)};
                      await AsyncStorage.setItem('portfolio', JSON.stringify(newPortfolio));

                      const existingPurchases = await AsyncStorage.getItem('purchases');
                      const purchases = existingPurchases ? JSON.parse(existingPurchases) : [];
                      purchases.push(purchase);
                      await AsyncStorage.setItem('purchases', JSON.stringify(purchases));

                      Alert.alert('Success', `You have successfully purchased ${numberOfShares} shares of ${symbol} at $${stockData.price.toFixed(2)} each for a total of $${totalCost.toFixed(2)}`);

                      const updatedTransactions = await AsyncStorage.getItem('transactions');
                      console.log('Updated transactions:', updatedTransactions);
                  } catch (error) {
                      console.error('Error saving purchase:', error);
                  }
                }
            }
        ],
        'plain-text',
        '1'
    );
   //} else {
     //Alert.alert('Market Closed', 'The market is currently closed. Please try again during market hours             (Mon-Fri 9:30-4).');
   //}
  };

  const handleSell = async () => {
    const now = new Date();
    const dayofweek = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
  
    // Check if market is open
    //for testing commenting out for now
    //if (dayofweek >= 1 && dayofweek <= 5 && (hour > 9 || (hour === 9 && minute >= 30)) && hour < 16) {
      Alert.prompt(
        'Sell Shares',
        `Enter the number of shares you want to sell for ${symbol} at $${stockData.price.toFixed(2)} each`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Sell',
            onPress: async (numberOfShares) => {
              const totalRevenue = numberOfShares * stockData.price;
              const portfolio = await AsyncStorage.getItem('portfolio');
              const userPortfolio = portfolio ? JSON.parse(portfolio) : {};
              const userHasEnoughShares = userPortfolio[symbol] && userPortfolio[symbol] >= parseInt(numberOfShares);
          
              if (!userHasEnoughShares) {
                  Alert.alert('Insufficient Shares', `You do not have enough shares of ${symbol} to sell.`);
                  return;
              }
          
              const newPortfolio = {...userPortfolio, [symbol]: userPortfolio[symbol] - parseInt(numberOfShares)};
              await AsyncStorage.setItem('portfolio', JSON.stringify(newPortfolio));
          
              const sale = {
                  symbol: symbol,
                  price: stockData.price,
                  date: new Date(),
                  quantity: -numberOfShares,
                  totalRevenue: totalRevenue,
              };
          
              const existingTransactions = await AsyncStorage.getItem('transactions');
              const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
              transactions.push(sale);
              await AsyncStorage.setItem('transactions', JSON.stringify(transactions));

              console.log(`Selling ${numberOfShares} shares at $${stockData.price.toFixed(2)} each`);
              console.log(`Total revenue from sale: $${totalRevenue.toFixed(2)}`);
              console.log(`Old balance: $${balance.toFixed(2)}`);



          
              const newBalance = balance + totalRevenue;
              await AsyncStorage.setItem('balance', newBalance.toString());
              setBalance(newBalance);

              const updatedTransactions = await AsyncStorage.getItem('transactions');
              console.log('Updated transactions:', updatedTransactions);

              console.log(`New balance: $${newBalance.toFixed(2)}`);

          
              Alert.alert('Success', `You have successfully sold ${numberOfShares} shares of ${symbol} at $${stockData.price.toFixed(2)} each for a total of $${totalRevenue.toFixed(2)}`);
            },
          },
        ],
        'plain-text',
        '1'
      );
    //} else {
    //  Alert.alert('Market Closed', 'The market is currently closed. Please try again during market hours (Mon-Fri 9:30-4).');
    //}
  };
  


  const CustomButton = ({ title, onPress, containerStyle, textStyle }) => {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.button, containerStyle]}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const handleCancel = () => {
    setDialogVisible(false);
    setNumberOfShares('');
  };

  const handleConfirm = async () => {
    setDialogVisible(false);
    const totalCost = numberOfShares * stockData.price;
    if (totalCost > balance) {
      Alert.alert('Insufficient Funds', `You do not have enough funds to purchase ${numberOfShares} shares of ${symbol}.`);
      return;
    }

    const purchase = {
      symbol: symbol,
      price: stockData.price,
      date: new Date(),
      quantity: numberOfShares,
      totalCost: totalCost,
      action: 'Buy'
    };

    try {
      const existingPurchases = await AsyncStorage.getItem('purchases');
      const purchases = existingPurchases ? JSON.parse(existingPurchases) : [];
      purchases.push(purchase);
      await AsyncStorage.setItem('purchases', JSON.stringify(purchases));
      setBalance(balance - totalCost);
      Alert.alert('Success', `You have successfully purchased ${numberOfShares} shares of ${symbol} at $${stockData.price.toFixed(2)} each for a total of $${totalCost.toFixed(2)}`);
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
    setNumberOfShares('');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const quoteEntries = stockData.quote ? Object.entries(stockData.quote) : [];
  const halfLength = Math.ceil(quoteEntries.length / 2);
  const firstHalf = quoteEntries.slice(0, halfLength);
  const secondHalf = quoteEntries.slice(halfLength);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Buy Shares</Dialog.Title>
        <Dialog.Description>
          Enter the number of shares you want to buy for {symbol} at ${stockData.price.toFixed(2)} each. Available balance: ${balance.toFixed(2)}
        </Dialog.Description>
        <Dialog.Input
          keyboardType="numeric"
          onChangeText={(text) => setNumberOfShares(text)}
          value={numberOfShares}
        />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Buy" onPress={handleConfirm} />
      </Dialog.Container>

      <View style={styles.header}>
        <LogoFetcher tickerSymbol={symbol} />
        <Text style={styles.title}>{symbol}</Text>
      </View>
      <Text style={styles.price}>
        {stockData.price ? `$${stockData.price.toFixed(2)}` : 'N/A'}
        <Text style={styles.currency}> USD</Text>
      </Text>
      <StockChart symbol={symbol} />
      <Text style={styles.testLine}>5 Year Trend</Text>

      <View style={styles.table}>
        <View style={styles.column}>
          {firstHalf.map(([key, value]) => (
            <Text key={key} style={styles.quoteText}>{key}: {value}</Text>
          ))}
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          {secondHalf.map(([key, value]) => (
            <Text key={key} style={styles.quoteText}>{key}: {value}</Text>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
      <CustomButton
        title="Buy"
        onPress={handleBuy}
        containerStyle={styles.buyButton}
        textStyle={styles.buyText}
      />
      <CustomButton
        title="Sell"
        onPress={handleSell}
        containerStyle={styles.sellButton}
        textStyle={styles.sellText}
      />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    paddingTop: 10,
    backgroundColor: '#FCFCFC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingTop:20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#312F2E',
  },
  buyText: {
    color: '#FFF',
  },
  sellButton: {
    backgroundColor: '#FCFCFC', 
    borderWidth: 1,
    borderColor: '#000',
  },
  sellText: {
    color: '#312F2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -40,
  },
  scrollView: {
    paddingTop: 40,
  },
  currency: {
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    paddingLeft: 5,
    fontSize: 24,
    fontWeight: "400",
    color: '#808080'
  },
  price: {
    paddingLeft: 5,
    fontSize: 35,
    marginVertical: 50,
    fontWeight: 'bold',
    color:'#312F2E'
  },
  table: {
    paddingLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FCFCFC',
  },
  column: {
    paddingLeft: 5,
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  testLine: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    marginTop: 10,
    backgroundColor: '#FCFCFC',
  },
  divider: {
    width: 1,
    backgroundColor: '#000000',
    marginHorizontal: 10,
  },
  quoteText: {
    fontSize: 16,
    marginVertical: 5,
    backgroundColor: '#FCFCFC',
  },
});

export default StockDetails;
