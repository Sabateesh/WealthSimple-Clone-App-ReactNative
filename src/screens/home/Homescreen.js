import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SecondCarousel from '../components/Homecarousel'
import PortfolioValueChart from '../components/portfolio';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  const [balance, setBalance] = useState(0);
  const [totalSharesValue, setTotalSharesValue] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [holdings, setHoldings] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        setBalance(storedBalance ? parseFloat(storedBalance) : 100000);

        await updateBalance();
        await updateTotalSharesValue();
        await loadPortfolioHistory();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      updateTotalSharesValue();
      updateBalance();
    }, 1 * 60 * 1000); // Update every 1 min
    const dailyInterval = setInterval(() => {
      updatePortfolioHistory();

    }, 1 * 60 * 1000);
    return () => {
      clearInterval(interval);
      clearInterval(dailyInterval);
    };
  }, []);

  const updateBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem('balance');
      setBalance(storedBalance ? parseFloat(storedBalance) : 100000);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const updateTotalSharesValue = async () => {
    try {
      const storedPurchases = await AsyncStorage.getItem('purchases');
      const purchases = storedPurchases ? JSON.parse(storedPurchases) : [];
      const storedSales = await AsyncStorage.getItem('sales');
      const sales = storedSales ? JSON.parse(storedSales) : [];
      let holdings = {};
  
      purchases.forEach(purchase => {
        if (!holdings[purchase.symbol]) {
          holdings[purchase.symbol] = 0;
        }
        holdings[purchase.symbol] += parseInt(purchase.quantity);
      });
  
      sales.forEach(sale => {
        if (holdings[sale.symbol]) {
          console.log(`Before sale: ${sale.symbol} holdings: ${holdings[sale.symbol]}, sale quantity: ${sale.quantity}`);
          holdings[sale.symbol] -= Math.abs(parseInt(sale.quantity));
          console.log(`After sale: ${sale.symbol} holdings: ${holdings[sale.symbol]}`);
        }
      });
  
      let totalValue = 0;
      let newHoldingsArray = [];


      for (const symbol in holdings) {
        if (holdings[symbol] > 0) {
          const response = await fetch(`https://sabateesh.pythonanywhere.com/stock_price?symbol=${symbol}`);
          const data = await response.json();
          totalValue += holdings[symbol] * data.price;

          let holding = {
            symbol: symbol,
            name: symbol,
            currentPrice: data.price,
            priceChange: data.change, 
            priceChangePercentage: data.changePercent, 
            shares: holdings[symbol],
          };
          newHoldingsArray.push(holding);
          }
      }
      console.log(`Total Portfolio Value: $${(totalValue)}`);
      setTotalSharesValue(totalValue);
      setHoldings(newHoldingsArray);
    } catch (error) {
      console.error('Error updating total shares value:', error);
    }
  };
  
  

  const loadPortfolioHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('portfolioHistory');
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      setPortfolioHistory(history);
    } catch (error) {
      console.error('Error loading portfolio history:', error);
    }
  };

  const updatePortfolioHistory = async () => {
    try {
      const currentDateTime = new Date().toISOString();
      const newEntry = { dateTime: currentDateTime, value: balance + totalSharesValue };
      const updatedHistory = [...portfolioHistory, newEntry];
      await AsyncStorage.setItem('portfolioHistory', JSON.stringify(updatedHistory));
      setPortfolioHistory(updatedHistory);
    } catch (error) {
      console.error('Error updating portfolio history:', error);
    }
  };
  

  return (
    <ScrollView style={styles.container1}>
      <View style={styles.container}>
        <PortfolioValueChart portfolioHistory={portfolioHistory} />
      </View>
        <Text style={styles.HoldingText}>Holdings</Text>
        <View style={styles.holdContainer}>
            <Text style={styles.balanceText}>Holdings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('HoldingsScreen', { holdings })}>
              <Text style={styles.balance}>{`View all`}</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.accountsText}>Accounts</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Cash</Text>
          <Text style={styles.balance}>{`$${balance.toFixed(2)}`}</Text>
        </View>
        <View style={styles.nonregContainer}>
          <Text style={styles.balanceText}>Non-registered</Text>
          <Text style={styles.balance}>{`$${totalSharesValue.toFixed(2)}`}</Text>
        </View>
        <View style={styles.addContainer}>
          <Text style={styles.balanceText}>Add an account</Text>
        </View>
        <View style={styles.morecontainer}>
          <Text style={styles.moreText}>More</Text>
        </View>
        <SecondCarousel></SecondCarousel>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container1:{
    backgroundColor: '#FCFCFC'
  },
  container: {
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    padding: 20,
    borderWidth: 1,
    borderRadius:8,
    marginLeft:10,
    marginRight:10,
    borderColor: '#E3E1E0',
    backgroundColor: '#FFF'
  },
  accountsText:{
    fontSize: 18,
    fontWeight: '700',
    color: '#312F2E',
    paddingBottom:5,
    paddingTop:20,
    paddingLeft:15
  },
  HoldingText:{
    fontSize: 18,
    fontWeight: '700',
    color: '#312F2E',
    paddingTop:25,
    paddingLeft:15   
  },
  addContainer: {
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderRadius:25,
    backgroundColor: '#FFF',
    borderColor:'#625E5B',
    marginLeft:10,
    marginRight:10,
  },
  nonregContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3E1E0',
    borderRadius:8,
    backgroundColor: '#FFF',
    marginLeft:10,
    marginRight:10,
  },
  holdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E3E1E0',
    borderRadius:8,
    backgroundColor: '#FFF',
    marginLeft:10,
    marginRight:10,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#312F2E',
  },
  balance: {
    fontSize: 20,
    color: '#312F2E',
    fontWeight: '700'
  },
  moreText:{
    color:'#312F2E',
    fontSize: 20,
    fontWeight: '700',
    paddingTop:25,
    paddingLeft:25,   
    paddingBottom:20
  }
});

export default HomeScreen;
