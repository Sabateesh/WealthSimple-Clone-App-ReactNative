import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SenateTradesCarousel = () => {
  const [tradesData, setTradesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cacheDuration = 3600000; // 1 hour in milliseconds

  useEffect(() => {
    const fetchTradesData = async () => {
      try {
        const urls = [
          'http://127.0.0.1:5000/trades/nancy-pelosi',
          'http://127.0.0.1:5000/trades/tommy-tuberville',
          'http://127.0.0.1:5000/trades/josh-gottheimer',
        ];
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(response => response.json()));

        const structuredData = data.map((trades, index) => ({
          title: `Trades by ${['Nancy Pelosi', 'Tommy Tuberville', 'Josh Gottheimer'][index]}`,
          description: 'Recent stock transactions',
          data: trades,
        }));

        await AsyncStorage.setItem('senateTradesData', JSON.stringify({ data: structuredData, timestamp: Date.now() }));
        setTradesData(structuredData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trades data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTradesData();
  }, []);

  useEffect(() => {
    const loadCachedData = async () => {
      const cachedDataString = await AsyncStorage.getItem('senateTradesData');
      if (cachedDataString) {
        const { data, timestamp } = JSON.parse(cachedDataString);
        const now = Date.now();
        if (now - timestamp < cacheDuration) {
          setTradesData(data);
          setLoading(false);
          return;
        }
      }
      fetchTradesData();
    };

    loadCachedData();
  }, []);

  const renderSlide = ({ item }) => {
    if (!item) {
      return null;
    }
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {item.data.map((trade, index) => (
          <View key={index} style={styles.tradeContainer}>
            <Text style={styles.stock}>{trade.stock}</Text>
            <Text style={styles.transaction}>{trade.transaction}</Text>
            <Text style={styles.amount}>{trade.transaction_amount}</Text>
            <Text style={styles.date}>{trade.traded}</Text>
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
            {tradesData.map((item, index) => (
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
                  {['Nancy Pelosi', 'Tommy Tuberville', 'Josh Gottheimer'][index]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Carousel
            ref={carouselRef}
            data={tradesData}
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
    borderWidth: 0.5,
    borderColor: '#DEDCDB',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: '#312F2F',
  },
  description: {
    fontSize: 18,
    color: '#63615E',
    paddingBottom: 10,
  },
  tradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  stock: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transaction: {
    fontSize: 16,
    color: 'grey',
  },
  amount: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
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
    fontWeight: '700',
  },
});

export default SenateTradesCarousel;
