import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { LineGraph } from 'react-native-graph';

const StockChart = ({ symbol }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [range, setRange] = useState('1y');

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

    fetchStockHistory();
  }, [symbol]);

  useEffect(() => {
    if (historicalData) {
      const endDate = new Date();
      let startDate;
      switch (range) {
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
    }
  }, [range, historicalData]);

  const onPointSelected = (point) => {
    setSelectedPoint(point);
  };

  if (!filteredData) {
    return <ActivityIndicator />;
  }

  return (
    <View>

      {selectedPoint && (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#017560' }}>
            ${selectedPoint.value.toFixed(1)}
          </Text>
          <Text style={{ color: 'gray' }}>
            {selectedPoint.date.toDateString()}
          </Text>
        </View>
      )}
      <LineGraph
        style={{ width: '100%', height: 300 }}
        points={filteredData}
        animated={true}
        color="#017560"
        gradientFillColors={['#0175605D', '#7476df00']}
        enablePanGesture
        onPointSelected={onPointSelected}
        enableIndicator
        indicatorPulsating
        enableFadeInMask
      />

      <View style={styles.buttonContainer}>
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
    marginBottom: 10,
  },
});

export default StockChart;

