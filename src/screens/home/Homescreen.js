import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import SecondCarousel from '../components/Homecarousel'

const HomeScreen = () => {
  const [balance, setBalance] = useState(0);
  const [totalSharesValue, setTotalSharesValue] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        setBalance(storedBalance ? parseFloat(storedBalance) : 100000);

        await updateTotalSharesValue();
        await loadPortfolioHistory();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      updateTotalSharesValue();
    }, 1 * 60 * 1000); // Update ever 5 min
    const dailyInterval = setInterval(() => {
      updatePortfolioHistory();
    }, 24 * 60 * 60 * 1000);
    return () => {
      clearInterval(interval);
      clearInterval(dailyInterval);
    };
  }, []);
  const updateTotalSharesValue = async () => {
    try {
      const storedPurchases = await AsyncStorage.getItem('purchases');
      const purchases = storedPurchases ? JSON.parse(storedPurchases) : [];
      const storedSales = await AsyncStorage.getItem('transactions');
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
          holdings[sale.symbol] -= parseInt(sale.quantity);
        }
      });
      let totalValue = 0;
      for (const symbol in holdings) {
        if (holdings[symbol] > 0) {
          const response = await fetch(`http://127.0.0.1:5000/stock_price?symbol=${symbol}`);
          const data = await response.json();
          totalValue += holdings[symbol] * data.price;
        }
      }
  
      console.log(`Holdings after sales: ${JSON.stringify(holdings)}`);
      console.log(`Total shares value: ${totalValue}`);
  
      setTotalSharesValue(totalValue);
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
      const currentDate = new Date().toISOString().split('T')[0];
      const newEntry = { date: currentDate, value: balance + totalSharesValue };
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
        <LineChart
          data={{
            labels: portfolioHistory.map(entry => entry.date),
            datasets: [
              {
                data: portfolioHistory.map(entry => entry.value),
              },
            ],
          }}
          width={Dimensions.get('window').width - 16} 
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
              paddingTop:-100,
              paddingBottom:10
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}          
          withVerticalLabels={false}
          withHorizontalLabels={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          bezier
        />
      </View>
        <Text style={styles.HoldingText}>Holdings</Text>
        <View style={styles.holdContainer}>
          <Text style={styles.balanceText}>Holdings</Text>
          <Text style={styles.balance}>{`View all`}</Text>
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
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 12,
    backgroundColor: '#FCFCFC'
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
