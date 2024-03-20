import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const StockNews = ({ ticker }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/news/${ticker}`);
        setNews(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [ticker]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.newsContainer}>
      <Text style={styles.newsHeading}>News</Text>
      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View all</Text>
      </TouchableOpacity>
      {news.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => Linking.openURL(item.link)} style={styles.newsItem}>
          <Text style={styles.newsDate}>{formatDate(item.published)}</Text>
          <Text style={styles.newsTitle}>{item.title}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.disclaimer}>We get news from a third-party provider. It’s not produced, verified or endorsed by Wealthsimple Practice.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  newsContainer: {
    padding: 15,
  },
  newsHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#312F2E',
  },
  viewAllButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  viewAllText: {
    fontSize: 16,
    color: '#635F5D',
    opacity: 0.6,
  },
  newsItem: {
    borderBottomColor: '#DEDDDC',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  newsDate: {
    fontSize: 14,
    color: '#000',
    opacity: 0.6,
    marginBottom: 5,
  },
  newsTitle: {
    fontSize: 18,
    color: '#312F2F',
    fontWeight:'bold'
  },
  disclaimer: {
    fontSize: 12,
    color: '#413D35',
    opacity: 0.6,
    marginTop: 10,
  },
});

export default StockNews;
