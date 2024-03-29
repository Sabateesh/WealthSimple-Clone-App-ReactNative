/*
import React, { useState,useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity,Dimensions, BackHandler, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import MarketMovers from '../components/Carosel';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageCarousel from '../components/imagecarrosel';
import debounce from 'lodash.debounce'; // Import the debounce function from lodash


const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const handleSearchFocus = () => {
    setIsFocused(true);
  };
  const handleSearchBlur = () => {
    setIsFocused(false);
  };
  
  
  const handleSearch = async (searchQuery) => {
    if (searchQuery.trim() === '') {
      setStocks([]);
      return;
    }
    try {
      const response = await fetch(`https://sabateesh.pythonanywhere.com/symbol_search?keywords=${searchQuery.trim()}`);
      const data = await response.json();
      if (data.bestMatches) {
        const formattedStocks = data.bestMatches.map(stock => ({
          symbol: stock['1. symbol'],
          name: stock['2. name'],
        }));
        setStocks(formattedStocks);
      } else {
        setStocks([]);
      }
    } catch (error) {
      console.error('Error fetching stock symbols:', error);
      setStocks([]);
    }
  };
  const debouncedSearch = debounce(handleSearch, 100);
  useEffect(() => {
    debouncedSearch(query);
    // Cleanup function to cancel the debounced call if the component unmounts
    return () => debouncedSearch.cancel();
  }, [query]);


  return (
    <View style={styles.container}>
      <View style={styles.headercontainer}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            onChangeText={setQuery}
            value={query}
            placeholder="Search"
            returnKeyType="search"
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>
          <FlatList
            data={stocks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stockItem}
                onPress={() => navigation.navigate('StockDetails', { symbol: item.symbol })}
              >
                <Text style={styles.stockName}>{item.symbol}</Text>
                <Text style={styles.stockPrice}>{item.name}</Text>
              </TouchableOpacity>
            )}            
          />
      {query.trim() === '' && (  
        <>
          <ScrollView style={styles.carouselContainer}>
            <ImageCarousel />
            <MarketMovers />
          </ScrollView>
        </>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  carouselContainer:{
    paddingTop:5,
    paddingLeft:-100,
  },
  headercontainer:{
    padding:10,
  },
  container: {
    backgroundColor:'#FCFCFC',
    flex: 1,
    padding: -20,
    paddingTop: 85,
  },
  stockItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockName: {
    fontSize: 18,
  },
  stockPrice: {
    fontSize: 18,
  },
  title: {
    paddingLeft: 150,
    marginBottom: 10,
    marginTop:-40,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 55,
    padding: 10,
    fontWeight: 'bold',
    color: 'black',
  },
});


export default SearchScreen;

*/
import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity,Dimensions, BackHandler, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import MarketMovers from '../components/Carosel';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageCarousel from '../components/imagecarrosel';


const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const handleSearchFocus = () => {
    setIsFocused(true);
  };
  const handleSearchBlur = () => {
    setIsFocused(false);
  };
  
  
  const handleSearch = async () => {
    if (query.trim() === '') {
      setStocks([]);
      return;
    }
    try {
      const response = await fetch(`https://sabateesh.pythonanywhere.com/stock_price?symbol=${query.trim()}`);
      const data = await response.json();
      if (data.price) {
        setStocks([{ symbol: data.symbol, price: data.price }]);
      } else {
        setStocks([]);
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
      setStocks([]);
    }

  };

  return (
    <View style={styles.container}>
      <View style={styles.headercontainer}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            onChangeText={setQuery}
            value={query}
            placeholder="Search"
            returnKeyType="search"
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>
          <FlatList
            data={stocks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stockItem}
                onPress={() => navigation.navigate('StockDetails', { symbol: item.symbol, price: item.price })}
              >
                <Text style={styles.stockName}>{item.symbol}</Text>
                <Text style={styles.stockPrice}>${item.price.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
          />
      {query.trim() === '' && (  
        <>
          <ScrollView style={styles.carouselContainer}>
            <ImageCarousel />
            <MarketMovers />
          </ScrollView>
        </>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  carouselContainer:{
    paddingTop:5,
    paddingLeft:-100,
  },
  headercontainer:{
    padding:10,
  },
  container: {
    backgroundColor:'#FCFCFC',
    flex: 1,
    padding: -20,
    paddingTop: 85,
  },
  stockItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockName: {
    fontSize: 18,
  },
  stockPrice: {
    fontSize: 18,
  },
  title: {
    paddingLeft: 150,
    marginBottom: 10,
    marginTop:-40,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 55,
    padding: 10,
    fontWeight: 'bold',
    color: 'black',
  },
});


export default SearchScreen;