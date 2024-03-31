import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const CompanyInfo = ({ symbol, apiKey }) => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/company-profile/${symbol}?apikey=${apiKey}`);
        setCompanyProfile(response.data[0]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch company profile');
        setCompanyProfile(null);
      }
    };

    fetchCompanyProfile();
  }, [symbol, apiKey]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!companyProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text style={styles.title}>Information</Text>
      <Text style={styles.description}> {companyProfile.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingLeft:15,
    paddingBottom:20,
    color:'#312F2E'
  },
  bold: {
    fontWeight: 'bold',
  },
  description:{
    fontSize:20,
    color:'#373635',
    paddingHorizontal:15,
    fontWeight:'400',
    paddingBottom:50
  }
});

export default CompanyInfo;
