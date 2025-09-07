import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppProvider';
import { useLocation } from '../hooks/useLocation';
import { fetchCurrentWeather, fetch5DayForecast, fetchNewsByQuery } from '../api/api';
import { WeatherCard } from '../components/WeatherCard';
import { NewsList } from '../components/NewsList';
import { mapWeatherToQuery } from '../utils/filter';
import { ForecastDay, NewsArticle, Weather } from '../types';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { state } = useAppContext();
  const { location, error: locError } = useLocation();

  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [forcedWeather, setForcedWeather] = useState<'cold' | 'hot' | 'cool' | null>(null);

  const [weatherLoading, setWeatherLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  const forceWeather = (type: 'cold' | 'hot' | 'cool') => {
    setForcedWeather(type);
  };

  // Set header options
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Settings" color="#1E90FF" onPress={() => navigation.navigate('Settings' as any)} />,
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff'
    });
  }, [navigation]);

  // Load weather, forecast, and news
  useEffect(() => {
    const load = async () => {
      if (!location) return;

      setWeatherLoading(true);
      setForecastLoading(true);
      setNewsLoading(true);

      try {
        // Fetch weather + forecast in parallel
        const [w, f] = await Promise.all([
          fetchCurrentWeather(location.lat, location.lon, state.units),
          fetch5DayForecast(location.lat, location.lon, state.units)
        ]);

        // Apply forced weather for testing
        if (forcedWeather === 'cold') {
          w.temp = 5;
          w.main = 'Snow';
        } else if (forcedWeather === 'hot') {
          w.temp = 32;
          w.main = 'Clear';
        } else if (forcedWeather === 'cool') {
          w.temp = 20;
          w.main = 'Clouds';
        }

        setWeather(w);
        setForecast(f);
        setWeatherLoading(false);
        setForecastLoading(false);

        // Fetch news based on weather and selected categories
        const query = mapWeatherToQuery(w.main, w.temp, state.units);
        const news = await fetchNewsByQuery(query, 10); // reduced pageSize for faster load
        setArticles(news);
        setNewsLoading(false);

      } catch (e: any) {
        console.warn(e.message || e);
        setWeatherLoading(false);
        setForecastLoading(false);
        setNewsLoading(false);
      }
    };

    load();
  }, [location, state.units, forcedWeather]);

  if (locError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Location error: {locError}</Text>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Weather Force Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 12 }}>
        {['cold', 'hot', 'cool'].map(type => {
          const isSelected = forcedWeather === type;
          const colors: any = { cold: '#4A90E2', hot: '#FF5C5C', cool: '#50E3C2' };
          const emojis: any = { cold: '❄️', hot: '🔥', cool: '🌤️' };
          const labels: any = { cold: 'Depressing News', hot: 'Fear News', cool: 'Happy News' };
          return (
            <TouchableOpacity
              key={type}
              style={{
                backgroundColor: 'transparent',
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? colors[type] : '#555',
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 20,
                alignItems: 'center',
                flex: 1,
                marginHorizontal: 3,
              }}
              onPress={() => forceWeather(type as any)}
            >
              <Text style={{ color: isSelected ? colors[type] : '#aaa', fontWeight: '600', fontSize: 12, textAlign: 'center' }}>
                {emojis[type]} {type.charAt(0).toUpperCase() + type.slice(1)}{"\n"}{labels[type]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Current Weather */}
        {weatherLoading ? <ActivityIndicator size="large" color="#1E90FF" /> : weather && <WeatherCard weather={weather} units={state.units} dark />}

        {/* 5-Day Forecast */}
        <Text style={styles.sectionTitle}>5-Day Forecast</Text>
        {forecastLoading ? <ActivityIndicator size="small" color="#1E90FF" /> : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {forecast.map(f => (
              <View key={f.date} style={styles.forecastCard}>
                <Text style={styles.forecastDate}>{f.date}</Text>
                <Text style={styles.forecastWeather}>{f.weather}</Text>
                <Text style={styles.forecastTemp}>{f.tempMin}° - {f.tempMax}°</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Filtered News */}
        <Text style={styles.sectionTitle}>Filtered News</Text>
        {newsLoading ? <ActivityIndicator size="small" color="#1E90FF" /> : <NewsList articles={articles} dark />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  errorText: { color: 'red', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 8, color: '#fff' },
  forecastCard: {
    width: 120,
    padding: 12,
    marginRight: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center'
  },
  forecastDate: { fontWeight: '600', color: '#bbb', marginBottom: 4 },
  forecastWeather: { fontSize: 14, color: '#1E90FF', marginBottom: 4 },
  forecastTemp: { fontSize: 16, fontWeight: '700', color: '#fff' }
});
