import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { LineGraph } from 'react-native-graph';

const StockChart = ({ symbol }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [range, setRange] = useState('5y');
  const [priceDifference, setPriceDifference] = useState(null);
  const [defaultPrice, setDefaultPrice] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [percentageDifference, setPercentageDifference] = useState(null);

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        const response = await fetch(`https://sabateesh.pythonanywhere.com/stock_history?symbol=${symbol}`);
        const data = await response.json();
        const formattedData = data.prices.map((price, index) => ({
          date: new Date(data.dates[index]),
          value: price
        }));

        setHistoricalData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error('Error fetching stock history:', error);
      }
    };
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/company_info?symbol=${symbol}`);
        const data = await response.json();
        setCurrency(data.currency);
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    };

    fetchCompanyInfo();
    fetchStockHistory();
  }, [symbol]);

  useEffect(() => {
    const fetchDefaultPrice = async () => {
      try {
        const response = await fetch(`https://sabateesh.pythonanywhere.com/stock_price?symbol=${symbol}`);
        const data = await response.json();
        setDefaultPrice(data.price);
      } catch (error) {
        console.error('Error fetching default price:', error);
      }
    };

    fetchDefaultPrice();
  }, [symbol]);

  const calculatePriceDifference = () => {
    if (historicalData && historicalData.length > 1) {
      const startPrice = historicalData[0].value;
      const endPrice = defaultPrice || historicalData[historicalData.length - 1].value;
      const diff = endPrice - startPrice;
      setPriceDifference(diff.toFixed(2));
      const percentageDiff = (diff / startPrice) * 100;
      setPercentageDifference(percentageDiff.toFixed(2));
    } else {
      setPriceDifference(null);
      setPercentageDifference(null);
    }
  };

  const getRangeText = () => {
    switch (range) {
      case '1w':
        return 'past week';
      case '1m':
        return 'past month';
      case '3m':
        return 'past 3 months';
      case '6m':
        return 'past 6 months';
      case '1y':
        return 'past year';
      case '5y':
        return 'past 5 years';
      default:
        return 'past year';
    }
  };

  useEffect(() => {
    if (historicalData) {
      const endDate = new Date();
      let startDate;
      switch (range) {
        case '1w':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
          break;
        case '1m':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
          break;
        case '1y':
          startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
          break;
        case '6m':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, endDate.getDate());
          break;
        case '3m':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
          break;
        case '5y':
          startDate = new Date(endDate.getFullYear() - 5, endDate.getMonth(), endDate.getDate());
          break;
        default:
          startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
      }

      let filtered = historicalData.filter(point => point.date >= startDate && point.date <= endDate);

      if (range === '5y') {
        const pointsByMonth = {};
        filtered.forEach(point => {
          const monthKey = `${point.date.getFullYear()}-${point.date.getMonth()}`;
          if (!pointsByMonth[monthKey] || point.date.getDate() > pointsByMonth[monthKey].date.getDate()) {
            pointsByMonth[monthKey] = point;
          }
        });
        filtered = Object.values(pointsByMonth);
      }

      setFilteredData(filtered);
      calculatePriceDifference();
      setSelectedPoint(filtered[filtered.length - 1] || null);
    }
  }, [range, historicalData, defaultPrice]);

  const onPointSelected = (point) => {
    setSelectedPoint(point);
    if (filteredData && point) {
      const startPrice = filteredData[0].value;
      const selectedPrice = point.value;
      const diff = selectedPrice - startPrice;
      setPriceDifference(diff.toFixed(2));
      const percentageDiff = (diff / startPrice) * 100;
      setPercentageDifference(percentageDiff.toFixed(2));
      setTimeout(() => {
        setSelectedPoint(null);
        setPriceDifference(null);
        setPercentageDifference(null);
        calculatePriceDifference();
      }, 5000);
    }
  };

  if (!filteredData || defaultPrice === null) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {selectedPoint ? (
        <View>
          <Text style={{ paddingLeft: 10, fontSize: 43, marginVertical: 5, fontWeight: 'bold', color:'#312F2E' }}>
            ${selectedPoint.value.toFixed(2)}
            <Text style={{fontSize: 20,fontWeight: "600"}}>{currency}</Text>
          </Text>
          {priceDifference && (
            <Text style={{ color: priceDifference >= 0 ? '#466636' : '#A6421C', paddingLeft: 10, fontSize:18 }}>
              {priceDifference >= 0 ? `+ $${priceDifference}` : `- $${Math.abs(priceDifference)}`}
            </Text>
          )}
          <Text style={{ color: 'gray' , paddingLeft: 10}}>
            {selectedPoint.date.toDateString()}
          </Text>
        </View>
      ) : (
        <View>
          <Text style={{paddingLeft: 10, fontSize: 43, marginVertical: 5, fontWeight: 'bold', color:'#312F2E'}}>
            ${defaultPrice.toFixed(2)}
            <Text style={{fontSize: 20,fontWeight: "600"}}>{currency}</Text>
          </Text>
          {priceDifference && percentageDifference && (
            <Text style={{ color: priceDifference >= 0 ? '#466636' : '#A6421C', paddingLeft: 10, fontSize:18 }}>
              {priceDifference >= 0 ? `+${priceDifference}` : priceDifference} ({percentageDifference}%) {getRangeText()}
            </Text>
          )}
        </View>
      )}
      <LineGraph
        style={{ width: '101%', height: 250 }}
        points={filteredData}
        animated={true}
        color="#7B9A53"
        gradientFillColors={['#DBECC0', '#F7F9F2']}
        enablePanGesture
        onPointSelected={onPointSelected}
        enableIndicator
        indicatorPulsating
        enableFadeInMask
      />
      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="1w" onPress={() => setRange('1w')} />
        <Button title="1m" onPress={() => setRange('1m')} />
        <Button title="3m" onPress={() => setRange('3m')} />
        <Button title="6m" onPress={() => setRange('6m')} />
        <Button title="1y" onPress={() => setRange('1y')} />
        <Button title="5y" onPress={() => setRange('5y')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    marginBottom: 10,
    color:'#3F3E3D'
  },
  button:{
    color:'#3F3E3D',
    backgroundColor: '#FCFCFC',
  }
});

export default StockChart;
