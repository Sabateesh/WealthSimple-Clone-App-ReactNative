import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LineGraph, GraphPoint, AxisLabel } from 'react-native-graph';

const StockChart = ({ symbol }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/stock_history?symbol=${symbol}`);
        const data = await response.json();
        const pointsByMonth = {};
  
        data.prices.forEach((price, index) => {
          const date = new Date(data.dates[index]);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
  
          if (!pointsByMonth[monthKey] || date.getDate() > pointsByMonth[monthKey].date.getDate()) {
            pointsByMonth[monthKey] = {
              date: date,
              value: price,
            };
          }
        });
  
        const monthlyPoints = Object.values(pointsByMonth);
        setHistoricalData(monthlyPoints);
      } catch (error) {
        console.error('Error fetching stock history:', error);
      }
    };
  
    fetchStockHistory();
  }, [symbol]);
  

  const onPointSelected = (point) => {
    setSelectedPoint(point);
  };

  if (!historicalData) {
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
        points={historicalData}
        animated={true}
        color="#017560"
        gradientFillColors={['#0175605D', '#7476df00']}
        enablePanGesture
        onPointSelected={onPointSelected}
        enableIndicator
        indicatorPulsating
        enableFadeInMask
      />
    </View>
  );
};

export default StockChart;
