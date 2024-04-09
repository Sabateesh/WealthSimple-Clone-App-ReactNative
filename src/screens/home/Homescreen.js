import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SecondCarousel from '../components/Homecarousel'
import PortfolioValueChart from '../components/portfolio';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import SenateTradesCarousel from '../components/senate-trading';
import FavoriteStockCard from '../components/favourites';
const HomeScreen = () => {
  const [balance, setBalance] = useState(0);
  const [totalSharesValue, setTotalSharesValue] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [holdings, setHoldings] = useState([]);
  const [favorites, setFavorites] = useState([]);




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
    const fetchFavoritesDetails = async () => {
      try {
        const favoritesData = await AsyncStorage.getItem('favorites');
        const favoritesArray = favoritesData ? JSON.parse(favoritesData) : [];


        const favoritesDetails = await Promise.all(favoritesArray.map(async (tickerSymbol) => {
          const cleanTickerSymbol = tickerSymbol.replace('.TO', '');
          const stockPriceResponse = await fetch(`https://sabateesh.pythonanywhere.com/stock_price?symbol=${tickerSymbol}`);
          const stockPriceData = await stockPriceResponse.json();
        
  
          const logoResponse = await fetch(`https://sabateesh.pythonanywhere.com/logo?ticker=${cleanTickerSymbol}`);
          const logoDataArray = await logoResponse.json();

          const companyInfoResponse = await fetch(`http://127.0.0.1:5000/company_info?symbol=${tickerSymbol}`);
          const companyInfoData = await companyInfoResponse.json();
          const percentageChange = ((stockPriceData.price - stockPriceData.quote.Open) / stockPriceData.quote.Open) * 100;
          const priceChangeColor = percentageChange >= 0 ? '#4CAF50' : '#F44336';

          return {
            ticker: tickerSymbol,
            company: companyInfoData.name,
            currentPrice: stockPriceData.price.toFixed(2),
            currency: companyInfoData.currency,
            percentageChange: percentageChange.toFixed(2),
            logoUri: logoDataArray.length > 0 ? logoDataArray[0].image : 'path_to_default_logo_image'
          };
        }));
        setFavorites(favoritesDetails);
      } catch (error) {
        console.error('Error fetching favorite stocks details:', error);
      }
    };
  
    fetchFavoritesDetails();
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
  useEffect(() => {
    console.log('Favoritesww:', favorites);
  }, [favorites]);


  

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
      let holdings = {};
  
      purchases.forEach(purchase => {
        if (!holdings[purchase.symbol]) {
          holdings[purchase.symbol] = { shares: 0, priceBought: purchase.priceBought };
        } else {
          holdings[purchase.symbol].priceBought = ((holdings[purchase.symbol].priceBought * holdings[purchase.symbol].shares) + (purchase.priceBought * purchase.quantity)) / (holdings[purchase.symbol].shares + purchase.quantity);
        }
        holdings[purchase.symbol].shares += parseInt(purchase.quantity);
      });
  
      let totalValue = 0;
      let newHoldingsArray = [];
  
      for (const symbol in holdings) {
        if (holdings[symbol].shares > 0) {
          const response = await fetch(`https://sabateesh.pythonanywhere.com/stock_price?symbol=${symbol}`);
          const data = await response.json();
          totalValue += holdings[symbol].shares * data.price;
  
          let holding = {
            symbol: symbol,
            name: symbol,
            currentPrice: data.price,
            priceChange: data.change, 
            priceChangePercentage: data.changePercent, 
            shares: holdings[symbol].shares,
            priceBought: holdings[symbol].priceBought
          };
          newHoldingsArray.push(holding);
        }
      }
      console.log(`Total Portfolio Value: $${totalValue}`);
      console.log('Updated Holdings:', newHoldingsArray);
      await AsyncStorage.setItem('holdings', JSON.stringify(newHoldingsArray));
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
        <Text style={styles.watchlistText}>My Watchlist</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.favoritesContainer}
      >
        {favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <FavoriteStockCard
              key={index}
              ticker={favorite.ticker}
              company={favorite.company}
              currentPrice={favorite.currentPrice}
              currency={favorite.currency}
              percentageChange={favorite.percentageChange}
              logoUri={favorite.logoUri}
              onPress={() => navigation.navigate('StockDetails', { symbol: favorite.ticker })}
            />
          ))
        ) : (
          <Text style={styles.noFavoritesText}>No favorites added yet.</Text>
        )}
      </ScrollView>
        <SenateTradesCarousel></SenateTradesCarousel>
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
    paddingLeft:15,
    paddingBottom:10   
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
  },
  watchlistText:{
    color:'#312F2E',
    fontSize: 20,
    fontWeight: '700',
    paddingTop:25,
    paddingLeft:25,   
    paddingBottom:20
  },
  favoritesContainer:{
    paddingLeft:20,
  }
});

export default HomeScreen;
