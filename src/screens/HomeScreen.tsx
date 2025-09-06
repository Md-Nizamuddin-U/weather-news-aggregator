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
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [forcedWeather, setForcedWeather] = useState<'cold' | 'hot' | 'cool' | null>(null);

  const forceWeather = (type: 'cold' | 'hot' | 'cool') => {
    setForcedWeather(type);
  };


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Settings" color="#1E90FF" onPress={() => navigation.navigate('Settings' as any)} />,
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff'
    });
  }, [navigation]);

  useEffect(() => {
    const load = async () => {
      if (!location) return;
      setLoading(true);
      try {
        const w = await fetchCurrentWeather(location.lat, location.lon, state.units);

        // Override weather based on forcedWeather
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

        console.log('Weather Used:', w.temp, w.main);

        setWeather(w);

        const f = await fetch5DayForecast(location.lat, location.lon, state.units);
        setForecast(f);

        const q = mapWeatherToQuery(w.main, w.temp, state.units);
        console.log('News Query:', q);

        setNewsLoading(true);
        const news = await fetchNewsByQuery(q, 20);
        setArticles(news);

      } catch (e: any) {
        console.warn(e.message || e);
      } finally {
        setLoading(false);
        setNewsLoading(false);
      }
    };

    load();
  }, [location, state.units, forcedWeather]);



  // useEffect(() => {
  //   const load = async () => {
  //     if (!location) return;
  //     setLoading(true);
  //     try {
  //       const w = await fetchCurrentWeather(location.lat, location.lon, state.units);
  //       setWeather(w);
  //       const f = await fetch5DayForecast(location.lat, location.lon, state.units);
  //       setForecast(f);
  //       const q = mapWeatherToQuery(w.main, w.temp, state.units);
  //       setNewsLoading(true);
  //       const news = await fetchNewsByQuery(q, 20);
  //       setArticles(news);
  //     } catch (e: any) {
  //       console.warn(e.message || e);
  //     } finally {
  //       setLoading(false);
  //       setNewsLoading(false);
  //     }
  //   };
  //   load();
  // }, [location, state.units]);

  if (locError) {
    return <SafeAreaView style={styles.centered}><Text style={styles.errorText}>Location error: {locError}</Text></SafeAreaView>;
  }

  if (!location || loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color="#1E90FF" /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 12 }}>

  {/* Cold Button */}
  <TouchableOpacity
    style={{
      backgroundColor: 'transparent',
      borderWidth: forcedWeather === 'cold' ? 2 : 1,
      borderColor: forcedWeather === 'cold' ? '#4A90E2' : '#555',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 20,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 3,
    }}
    onPress={() => forceWeather('cold')}
  >
    <Text
      style={{
        color: forcedWeather === 'cold' ? '#4A90E2' : '#aaa',
        fontWeight: '600',
        fontSize: 12,
        textAlign: 'center',
      }}
    >
      ❄️ Cold{"\n"}Depressing News
    </Text>
  </TouchableOpacity>

  {/* Hot Button */}
  <TouchableOpacity
    style={{
      backgroundColor: 'transparent',
      borderWidth: forcedWeather === 'hot' ? 2 : 1,
      borderColor: forcedWeather === 'hot' ? '#FF5C5C' : '#555',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 20,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 3,
    }}
    onPress={() => forceWeather('hot')}
  >
    <Text
      style={{
        color: forcedWeather === 'hot' ? '#FF5C5C' : '#aaa',
        fontWeight: '600',
        fontSize: 12,
        textAlign: 'center',
      }}
    >
      🔥 Hot{"\n"}Fear News
    </Text>
  </TouchableOpacity>

  {/* Cool Button */}
  <TouchableOpacity
    style={{
      backgroundColor: 'transparent',
      borderWidth: forcedWeather === 'cool' ? 2 : 1,
      borderColor: forcedWeather === 'cool' ? '#50E3C2' : '#555',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 20,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 3,
    }}
    onPress={() => forceWeather('cool')}
  >
    <Text
      style={{
        color: forcedWeather === 'cool' ? '#50E3C2' : '#aaa',
        fontWeight: '600',
        fontSize: 12,
        textAlign: 'center',
      }}
    >
      🌤️ Cool{"\n"}Happy News
    </Text>
  </TouchableOpacity>

</View>

      

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Current Weather */}
        {weather && <WeatherCard weather={weather} units={state.units} dark />}

        {/* 5-Day Forecast */}
        <Text style={styles.sectionTitle}>5-Day Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {forecast.map(f => (
            <View key={f.date} style={styles.forecastCard}>
              <Text style={styles.forecastDate}>{f.date}</Text>
              <Text style={styles.forecastWeather}>{f.weather}</Text>
              <Text style={styles.forecastTemp}>{f.tempMin}° - {f.tempMax}°</Text>
            </View>
          ))}
        </ScrollView>

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
