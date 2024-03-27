import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LineGraph } from 'react-native-graph';

const PortfolioValueChart = ({ portfolioHistory }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const onPointSelected = (point) => {
    setSelectedPoint(point);
  };

  if (!portfolioHistory) {
    return <ActivityIndicator />;
  }
  const graphPoints = portfolioHistory.map(entry => ({
    date: new Date(entry.dateTime || entry.date),
    value: entry.value
  }));

  const validGraphPoints = graphPoints.filter(point => !isNaN(point.date));

  console.log('validGraphPoints data:', validGraphPoints);

  if (validGraphPoints.length === 0) {
    console.log('No valid graph points');
    return <Text>No valid data available for the graph.</Text>;
  }

  return (
    <View>
      {selectedPoint && (
        <View>
          <Text style={{ fontSize: 38, fontWeight: 'bold', color: '#312F2E', padding: 15 }}>
            ${selectedPoint.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={{ color: 'gray' }}>
            {selectedPoint.date.toLocaleString()} 
          </Text>
        </View>
      )}

      <LineGraph
        style={{ width: '100%', height: 300, backgroundColor: '#FCFCFC' }}
        points={validGraphPoints}
        animated={true}
        color="#7B9A53"
        gradientFillColors={['#DBECC0', '#F7F9F2']}
        enablePanGesture
        onPointSelected={onPointSelected}
        enableIndicator
        indicatorPulsating
        enableFadeInMask
      />
    </View>
  );
};

export default PortfolioValueChart;
