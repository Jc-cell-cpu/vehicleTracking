import React from 'react';
import { useWindowDimensions } from 'react-native';
import Svg, { Circle, Rect, Text } from 'react-native-svg';

const AFMSLogo = () => {
  const { width } = useWindowDimensions();

  return (
    <Svg width={width} height={160} viewBox="0 0 600 180">
      {/* Background: white */}
      <Rect width="100%" height="100%" fill="#ffffff" />

      {/* Logo Circle */}
      <Circle cx="90" cy="90" r="65" fill="#ff6f00" />

      {/* AFMS letters inside the circle */}
      <Text
        x="90"
        y="100"
        fontSize="32"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
      >
        AFMS
      </Text>

      {/* Title: Automated Fitness Management System */}
      <Text
        x="180"
        y="60"
        fontSize="20"
        fill="#2c3e50"
        fontWeight="bold"
      >
        Automated Fitness Management System
      </Text>

      {/* Hindi ministry name */}
      <Text
        x="180"
        y="95"
        fontSize="16"
        fill="#555555"
      >
        सड़क परिवहन और राजमार्ग मंत्रालय
      </Text>

      {/* English ministry name */}
      <Text
        x="180"
        y="120"
        fontSize="16"
        fill="#555555"
      >
        Ministry of Road Transport and Highways
      </Text>
    </Svg>
  );
};

export default AFMSLogo;
