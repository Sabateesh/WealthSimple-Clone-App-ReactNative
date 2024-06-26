import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LogoFetcher from './logofetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MarketMoversCarousel = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cacheDuration = 3600000; // 1 hour in milliseconds

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const urls = [
          'https://sabateesh.pythonanywhere.com/day_gainers',
          'https://sabateesh.pythonanywhere.com/day_losers',
          'https://sabateesh.pythonanywhere.com/most_active',
          'https://sabateesh.pythonanywhere.com/top_cryptos',
        ];
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(response => response.json()));

        console.log('Raw API Responses:', data); // Log raw data


        const structuredData = [
          {
            title: 'Most Active Stocks 🔥',
            description: 'Most Frequently traded today',
            data: data[2],
            button: 'Active',
          },
          {
            title: 'Day Gainers 📈',
            description: 'Stocks with the biggest price increases today',
            data: data[0],
            button: 'Gainers',
          },
          {
            title: 'Day Losers 📉',
            description: 'Stocks with the biggest price drops today',
            data: data[1],
            button: 'Losers',
          },
          {
            title: 'Top Cryptocurrencies 💰',
            description: 'Cryptocurrencies with the highest market cap',
            data: data[3].slice(0, 3),
            button: 'Cryptos',
            isCrypto: true,
          },
        ];

        console.log('Structured Data:', structuredData); // Log structured data

        
        await AsyncStorage.setItem('marketMoversData', JSON.stringify({ data: structuredData, timestamp: Date.now() }));
        setMarketData(structuredData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  useEffect(() => {
    const loadCachedData = async () => {
      const cachedDataString = await AsyncStorage.getItem('marketMoversData');
      if (cachedDataString) {
        const { data, timestamp } = JSON.parse(cachedDataString);
        const now = Date.now();
        if (now - timestamp < cacheDuration) {
          setMarketData(data);
          setLoading(false);
          return;
        }
      }
      fetchMarketData();
    };
  
    loadCachedData();
  }, []);

  const renderSlide = ({ item }) => {
    if (!item) {
      return null;
    }
    if (!Array.isArray(item.data)) {
      console.error('item.data is not an array:', item.data);
      return null;
    }
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
  
        {item.data.map((stock, index) => (
          <View key={index} style={styles.stockContainer}>
            <View style={styles.stockLeft}>
              <LogoFetcher
                tickerSymbol={stock.Symbol}
                type={item.isCrypto ? 'crypto' : 'stock'}
              />
              <View style={styles.stockInfo}>
                <Text style={styles.symbol}>{stock.Symbol}</Text>
                <Text style={styles.name}>{stock.Name}</Text>
              </View>
            </View>
            <View style={styles.stockRight}>
              <Text style={styles.price}>
                {stock['Price (Intraday)'] ? `$${stock['Price (Intraday)']}` : 'N/A'}
              </Text>
              <Text
                style={[
                  styles.change,
                  { color: stock['% Change'] > 0 ? 'green' : 'red' },
                ]}
              >
                {stock['% Change'] ? `(${stock['% Change']}%)` : 'N/A'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  

  return (
    <View style={{ paddingTop: 25 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View style={styles.buttonContainer}>
            {marketData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  { backgroundColor: index === activeIndex ? '#312F2E' : '#FBFBFB' },
                ]}
                onPress={() => {
                  carouselRef.current.snapToItem(index);
                  setActiveIndex(index);
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: index === activeIndex ? '#FCFCFB' : '#312F2E' },
                  ]}
                >
                  {item.button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Carousel
          ref={carouselRef}
          data={marketData}
          renderItem={({ item }) => renderSlide({ item })}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width * 0.85}
          layout={'default'}
          onSnapToItem={(index) => setActiveIndex(index)}
          />
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  slide: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    paddingBottom: 70,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 115,
    borderWidth:.5,
    borderColor: '#DEDCDB'
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    paddingBottom: 10,
    color:'#312F2F'
  },
  stockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  stockLeft: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '95%',
  },
  stockRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '55%',
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 12,
    color: 'grey',
  },
  price: {
    fontSize: 16,
  },
  change: {
    fontSize: 16,
  },
  description: {
    fontSize: 18,
    color: '#63615E',
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#312F2E',
    padding: 10,
    marginHorizontal: 1,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 22,
    color: '#FCFCFC',
    fontWeight: '700'
  },
});

export default MarketMoversCarousel;
