import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FavoriteStockCard = ({
  ticker,
  company,
  currentPrice,
  currency,
  percentageChange,
  logoUri,
  onPress,
}) => {
  const formattedCurrentPrice = Number(currentPrice).toFixed(2);
  const priceChangeColor = percentageChange >= 0 ? '#4C633D' : '#A73D0C';
  const [logoSize, setLogoSize] = useState({ width: 30, height: 30 });

  useEffect(() => {
    if (logoUri) {
      Image.getSize(
        logoUri,
        (width, height) => {
          const aspectRatio = width / height;
          const logoWidth = 25;
          const logoHeight = logoWidth / aspectRatio;
          setLogoSize({ width: logoWidth, height: logoHeight });
        },
        (error) => {
          console.error('Error getting logo size:', error);
        }
      );
    }
  }, [logoUri]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Image
          source={{ uri: logoUri }}
          style={[styles.logo, { width: logoSize.width, height: logoSize.height }]}
          resizeMode='contain'
        />
        <View style={styles.textContainer}>
          <Text style={styles.ticker}>{ticker}</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.currentPrice}>{`${formattedCurrentPrice} ${currency}`}</Text>
        <Text style={[styles.percentageChange, { color: priceChangeColor }]}>
          {percentageChange}%
        </Text>
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.company}>{company}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FDFBFC',
    borderRadius: 15,
    padding: 16,
    width: 150,
    marginHorizontal: 8,
    marginVertical: 16,
    borderWidth:1,
    borderColor:'#E0E0E0'
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
    color: '#313131',
    fontWeight: 'bold',
    fontSize: 20,
  },
  currentPrice: {
    color: '#605F5C',
    fontSize: 19,
    fontWeight:'700',
    paddingBottom:10,
    paddingTop:10
  },
  bottomRow: {
    marginTop: 8,
    alignItems: 'flex-startß',
  },
  percentageChange: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingBottom:5
  },
  company: {
    color: '#303030',
    fontSize: 15,
    textAlign: 'center',
    paddingBottom:5
  },
});

export default FavoriteStockCard;
