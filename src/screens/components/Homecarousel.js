import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const SecondCarousel = ({ data }) => {
  const renderItem = ({ item, index }) => {
    const colors = ['#ECF2F6', '#ECF2F6', '#EBF2D4'];
    const textColors = ['#446173', '#476173', '#596334'];
    const textColorsdesc = ['#2A5368', '#285368', '#3E4A00'];
    const titleMarginStyles = [
      { marginRight: 60 },
      { marginRight: 60 },
      { marginRight: 60 },
    ];
    const descriptionMarginStyles = [
      { marginRight: 110},
      { marginRight: 120, paddingBottom: 40 },
      { marginRight: 60, paddingBottom: 70 },
    ];
    const images = [
        require('../../assets/img5.png'),
        require('../../assets/img6.png'),
        require('../../assets/img7.png'),

      ];
    const imageSource = images[index % images.length];
    const imageStyles = [
        { width: 160, height: 160, resizeMode: 'contain', marginLeft: 160, marginTop: -90 },
        { width: 110, height: 110, resizeMode: 'contain', marginLeft: 220, marginTop: -110 },
        { width: 125, height: 125, resizeMode: 'contain', marginLeft: 195, marginTop: -110},
    ];
    const selectedImageStyle = imageStyles[index % imageStyles.length];


    const backgroundColor = colors[index % colors.length];
    const textColor = textColors[index % textColors.length];
    const textColorsdes = textColorsdesc[index % textColorsdesc.length];
    const selectedTitleMarginStyle = titleMarginStyles[index % titleMarginStyles.length];
    const selectedDescriptionMarginStyle = descriptionMarginStyles[index % descriptionMarginStyles.length];

    return (
        <View style={[styles.slide, { backgroundColor }]}>
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: textColor }, selectedTitleMarginStyle]}>{item.title}</Text>
              <Text style={[styles.description, { color: textColorsdes }, selectedDescriptionMarginStyle]}>{item.description}</Text>
            </View>
            <Image source={imageSource} style={selectedImageStyle} />
          </View>
        </View>
      );
    };

  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      sliderWidth={Dimensions.get('window').width}
      itemWidth={Dimensions.get('window').width * 0.85}
      layout={'default'}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    borderRadius: 8,
    paddingLeft:15,
    paddingTop:15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'left',
    paddingBottom:10
  },
  description: {
    fontSize: 20,
    textAlign: 'left',
    fontWeight: '300',
  },
  image: {
    width: 160, 
    height: 160,
    resizeMode: 'contain',
    marginLeft:160,
    marginTop:-70,
  },
});

const App = () => {
  const data = [
    { title: 'Boost your interest to 4.5%', description: 'Direct Deposit your paycheque to Cash to unlock your boosted rate.' },
    { title: '25$ for you, 25$ for them', description: 'Refer friends and you\'ll both get 25$ when they open and fund an account. T&C\'s apply'},
    { title: 'Professionally managed portfolios, tailored to you.', description: 'Get a low fee, diversified portfolio built by experts' },
  ];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SecondCarousel data={data} />
    </View>
  );
};

export default App;
