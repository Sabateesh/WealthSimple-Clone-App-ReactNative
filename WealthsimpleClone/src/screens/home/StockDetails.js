import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Button, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoFetcher from '../components/logofetch';




const StockDetails = ({ route }) => {
  const { symbol } = route.params;
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  

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
        const historyResponse = await fetch(`http://127.0.0.1:5000/stock_history?symbol=${symbol}`);
        const historyData = await historyResponse.json();
        setHistoricalData({
            labels: historyData.dates,
            datasets: [{
                data: historyData.prices
            }]
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
    const purchase = {
      symbol: symbol,
      price: stockData.price,
      date: new Date()
    };

    try {
      const existingPurchases = await AsyncStorage.getItem('purchases');
      const purchases = existingPurchases ? JSON.parse(existingPurchases) : [];
      purchases.push(purchase);
      await AsyncStorage.setItem('purchases', JSON.stringify(purchases));
      Alert.alert('Success', `You have successfully purchased ${symbol} at $${stockData.price.toFixed(2)}`);
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
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
      <View style={styles.header}>
        <LogoFetcher tickerSymbol={symbol} />
        <Text style={styles.title}>{symbol}</Text>
      </View>
      <Text style={styles.price}>
         {stockData.price ? `$${stockData.price.toFixed(2)}` : 'N/A'}
        <Text style={styles.currency}> USD</Text>
    </Text>

      {historicalData && (
        <LineChart
          data={historicalData}
          width={Dimensions.get('window').width+25} // from react-native
          height={390}
          chartConfig={{
            backgroundColor: "#F2F2F2",
            backgroundGradientFrom: "#F2F2F2",
            backgroundGradientTo: "#F2F2F2",
            decimalPlaces:1,
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // green line
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: ".05",
              strokeWidth: "2",
              stroke: "#00ff00"
            }
          }}
          withVerticalLabels={false} 
          withHorizontalLabels={false}
          withVerticalLines={false} 
          withHorizontalLines={false}
          bezier
          style={{
            paddingRight:1,
            borderRadius: 16,
            paddingTop:0,
            marginRight:40,
          }}
        />
      )}
      <Text style={styles.testLine}>1 Year Trend</Text>

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
      <Button title="Buy" onPress={handleBuy} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    paddingTop: 10,

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
    color:'#808080'
  },
  price: {
    paddingLeft: 5,
    fontSize: 35,
    marginVertical: 50,
    fontWeight: 'bold',

  },
  table: {
    paddingLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    paddingLeft: 5,
    flex: 1,
  },
  testLine: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    marginTop:-80,
  },
  divider: {
    width: 1,
    backgroundColor: '#F2F2F2',
    marginHorizontal: 10,
  },
  quoteText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default StockDetails;
