import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const StockChart = ({ symbol }) => {
    const [historicalData, setHistoricalData] = useState({
      labels: [],
      datasets: [{ data: [] }]
    });
  
    useEffect(() => {
      const fetchStockHistory = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/stock_history?symbol=${symbol}`);
          const data = await response.json();
          setHistoricalData({
            labels: data.dates,
            datasets: [{ data: data.prices }]
          });
        } catch (error) {
          console.error('Error fetching stock history:', error);
        }
      };
  
      fetchStockHistory();
    }, [symbol]);
    
  return (
    <LineChart
      data={historicalData}
      width={Dimensions.get('window').width + 25}
      height={390}
      chartConfig={{
        backgroundColor: "#FCFCFC",
        backgroundGradientFrom: "#FCFCFC",
        backgroundGradientTo: "#FCFCFC",
        decimalPlaces: 1,
        color: (opacity = 0.1) => `#7b9a54`,
        style: {},
        propsForDots: {
          r: "0.0",
          strokeWidth: "5",
          stroke: "#00ff00"
        }
      }}
      withVerticalLabels={false}
      withHorizontalLabels={false}
      withVerticalLines={false}
      withHorizontalLines={false}
      bezier
      style={{
        paddingRight: 0,
        borderRadius: 16,
        paddingTop: 0,
        marginRight: 20,
        backgroundColor: '#FCFCFC',
      }}
    />
  );
};

export default StockChart;
