import { Card } from '@rneui/base';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HoldingsCard = ({ symbol, sharesOwned, currentPrice, priceBought }) => {
    const bookValue = (priceBought * sharesOwned).toFixed(2);
    console.log(`HoldingsCard - Symbol: ${symbol}, Price Bought: $${priceBought}, Amount: ${sharesOwned}`);
    const totalReturn = (currentPrice - priceBought) * sharesOwned;
    const totalReturnPercentage = ((currentPrice - priceBought) / priceBought) * 100;


    return (
      <Card containerStyle={{ marginTop: -5, borderRadius:15, backgroundColor:'#FDFDFD' }}>
        <View style={styles.row}>
          <Text style={styles.shares}>{`${sharesOwned} share${sharesOwned > 1 ? 's' : ''}`}</Text>
          <Text style={styles.currentPrice}>{`$${currentPrice}`}</Text>
        </View>
        <Card.Divider />
        <View style={styles.row}>
          <Text style={styles.bookValue}>Book Value</Text>
          <Text style={styles.bookValue2}>${bookValue}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bookValue}>Total return:</Text>
           <Text style={[styles.bookValue2, { color: totalReturn >= 0 ? 'green' : 'red' }]}>
            ${totalReturn.toFixed(2)} ({totalReturnPercentage.toFixed(2)}%)
          </Text>
        </View>
      </Card>
    );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FFF',
      padding: 15,
      borderRadius: 15,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    shares: {
      fontSize: 24,
      fontWeight: '600',
      color:'#312F2E'
    },
    currentPrice: {
      fontSize: 24,
      fontWeight: '600',
      color:'#312F2E'
    },
    detail: {
      fontSize: 16,
      color:'#312F2E'
    },
    bookValue:{
      fontSize: 18,
      color:'#312F2E',
      fontWeight:'600'
    },
    bookValue2:{
      fontSize: 18,
      color:'#312F2E',
      fontWeight:'300'
    }
  });
  
export default HoldingsCard;
