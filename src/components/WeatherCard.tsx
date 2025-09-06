import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Weather } from '../types';

export function WeatherCard({ weather, units }: { weather: Weather; units: 'metric' | 'imperial' }) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
          style={{ width: 80, height: 80 }}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.temp}>{Math.round(weather.temp)}°{units === 'metric' ? 'C' : 'F'}</Text>
          <Text style={styles.desc}>{weather.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
    marginVertical: 8
  },
  temp: {
    fontSize: 28,
    fontWeight: '700'
  },
  desc: {
    fontSize: 14,
    color: '#333'
  }
});
