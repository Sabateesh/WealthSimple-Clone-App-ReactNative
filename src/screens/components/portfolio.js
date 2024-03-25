import React, { useEffect, useState } from 'react';
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
    date: new Date(entry.date),
    value: entry.value
  }));

  return (
    <View>
      {selectedPoint && (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#017560' }}>
            ${selectedPoint.value.toFixed(2)}
          </Text>
          <Text style={{ color: 'gray' }}>
            {selectedPoint.date.toDateString()}
          </Text>
        </View>
      )}

      <LineGraph
        style={{ width: '100%', height: 300 }}
        points={graphPoints}
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

export default PortfolioValueChart;
