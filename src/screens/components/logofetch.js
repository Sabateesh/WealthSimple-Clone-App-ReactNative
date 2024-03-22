import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import axios from 'axios';

const LogoFetcher = ({ tickerSymbol, type = 'stock' }) => {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const apiUrl = type === 'crypto'
          ? `https://sabateesh.pythonanywhere.com/crypto_logo?symbol=${tickerSymbol}`
          : `https://sabateesh.pythonanywhere.com/logo?ticker=${tickerSymbol}`;

        const response = await axios.get(apiUrl);
        const logoData = response.data[0];
        if (logoData) {
          setLogoUrl(logoData.image);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogoUrl();
  }, [tickerSymbol, type]);


  return (
    <View style={styles.container}>
      {logoUrl ? (
        <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    borderColor:'#000000',
    borderWidth: 0.0,
  },
  logo: {
    width: 40,
    height: 40,
  },
  placeholder: {
    width: 40,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
});

export default LogoFetcher;
