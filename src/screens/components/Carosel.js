import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LogoFetcher from './logofetch';

const MarketMoversCarousel = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const urls = [
          'http://127.0.0.1:5000/day_gainers',
          'http://127.0.0.1:5000/day_losers',
          'http://127.0.0.1:5000/most_active',
        ];
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(response => response.json()));

        const structuredData = [
            { 
              title: 'Most Active Stocks 🔥', 
              description: 'Most Frequently traded today',
              data: data[2]
            },
            { 
              title: 'Day Gainers 📈', 
              description: 'Stocks with the biggest price increases today',
              data: data[0] 
            },
            { 
              title: 'Day Losers 📉', 
              description: 'Stocks with the biggest price drops today',
              data: data[1] 
            },
        ];
          

        setMarketData(structuredData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
  
      {item.data.map((stock, index) => (
        <View key={index} style={styles.stockContainer}>
          <View style={styles.stockLeft}>
          <LogoFetcher tickerSymbol={stock.Symbol} />
            <View style={styles.stockInfo}>
              <Text style={styles.symbol}>{stock.Symbol}</Text>
              <Text style={styles.name}>{stock.Name}</Text>
            </View>
          </View>
          <View style={styles.stockRight}>
            <Text style={styles.price}>${stock['Price (Intraday)'].toFixed(2)}</Text>
            <Text style={[styles.change, { color: stock['% Change'] > 0 ? 'green' : 'red' }]}>
              ({stock['% Change'].toFixed(2)}%)
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
  
  

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ paddingTop: 55 }}>
    <Carousel
      data={marketData}
      renderItem={renderSlide}
      sliderWidth={Dimensions.get('window').width}
      itemWidth={Dimensions.get('window').width * 0.85}
      layout={'default'}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    paddingBottom:100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight:115
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
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
    fontSize: 14,
    color: 'grey',
    paddingBottom: 10,
  },
});

export default MarketMoversCarousel;
