import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FavoriteStockCard = ({ 
  ticker, 
  company, 
  currentPrice, 
  currency, 
  percentageChange, 
  logoUri, 
  onPress 
}) => {
  const formattedCurrentPrice = Number(currentPrice).toFixed(2);
  const priceChangeColor = percentageChange.startsWith('+') ? '#4CAF50' : '#F44336';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
      <Image 
        source={{ uri: logoUri }} 
        style={[styles.logo, { width: 35, height: 35 }]} 
        resizeMode='cover'
      />
        <View style={styles.textContainer}>
          <Text style={styles.ticker}>{ticker}</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.currentPrice}>{`${formattedCurrentPrice} ${currency}`}</Text>
        <Text style={[styles.percentageChange, { color: priceChangeColor }]}>
          {percentageChange}
        </Text>
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.company}>{company}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 16,
    width: 150,
    marginHorizontal: 8,
    marginVertical: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  ticker: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  currentPrice: {
    color: '#FFF',
    fontSize: 16,
    fontWeight:'700'
  },
  bottomRow: {
    marginTop: 8,
    alignItems: 'flex-startß',
  },
  percentageChange: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default FavoriteStockCard;
