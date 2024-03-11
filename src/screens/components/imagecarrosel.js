import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import img1 from '../../assets/img1.jpg'
import img2 from '../../assets/img2.jpg'
import img3 from '../../assets/img3.jpg'
import img4 from '../../assets/img4.jpg'
import {LinearGradient} from 'expo-linear-gradient';


const images = [img1, img2, img3, img4];

const slides = [
    {
      image: img1,
      title: "TLDR🤑 Podcast  ·  Mar 6",
      subtitle: "Listener, This is a Wendy's"
    },
    {
      image: img2,
      title: "TLDR🤑 Big Story  ·  Mar 4",
      subtitle: "The Budget for People Who Hate Budgeting"
    },
    {
        image: img4,
        title: "TLDR🤑 Big Story  ·  Feb 26",
        subtitle: "There's a New Space Race. Big Tech Want to Win"
    },
    {
        image: img3,
        title: "TLDR🤑 Big Story  ·  Feb 12",
        subtitle: "Can You Save Enough to Retire at 50? We Did the Math"
    },

]
const ImageCarousel = () => {
    const renderItem = ({ item }) => (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.99)']}
        style={styles.gradient}
      />
        <View style={styles.textOverlay}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.subtitleText}>{item.subtitle}</Text>
        </View>
      </View>
    );
  
    return (
      <Carousel
        data={slides}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width * 0.85}
        layout={'default'}
      />
    );
  };
  
  const styles = StyleSheet.create({
    slide: {
      backgroundColor: 'white',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    textOverlay: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      right: 10,
      padding: 5,
      borderRadius: 8,
    },
    titleText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      paddingBottom:5,
    },
    subtitleText: {
      color: 'white',
      fontSize: 18,
      fontWeight:'700'
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        borderRadius: 8,
      },
  });
  
  export default ImageCarousel;