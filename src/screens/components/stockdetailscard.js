
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Fontisto';

import { View, Text, StyleSheet,TouchableOpacity,onButtonPress } from 'react-native';

const StockCard = ({ ticker }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{ticker}</Text>
      <TouchableOpacity style={styles.button} onPress={onButtonPress}>
        <Icon name="staro" size={25} color="#000" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onButtonPress}>
        <Icon2 name="bell" size={25} color="#000" style={styles.icon2} />
      </TouchableOpacity>
    </View>
  );
  
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:-70,
  },
  title: {
    marginTop: 45,
    marginLeft:160,
    fontWeight: 'bold',
    fontSize:16,
  },
  content: {
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginTop:45,
    marginLeft: 65,
  },
  icon2: {
    marginTop:45,

  }
});

export default StockCard;
