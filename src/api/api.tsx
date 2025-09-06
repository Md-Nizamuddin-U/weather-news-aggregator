import axios from 'axios';
import { ForecastDay, NewsArticle, Weather } from '../types';

const OPENWEATHER_KEY = 'e263b8846414af614b1532a5fa848c9b';
const NEWSAPI_KEY = '06089af9e9f14cc19b73531c61a0c6b5';


/**
 * Get current weather (OpenWeatherMap)
 */
export async function fetchCurrentWeather(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<Weather> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_KEY}`;
  const { data } = await axios.get(url);
  return {
    temp: data.main.temp,
    description: data.weather[0].description,
    main: data.weather[0].main,
    icon: data.weather[0].icon,
  };
}

/**
 * Get 5-day forecast (we'll reduce to daily by taking midday items)
 */
export async function fetch5DayForecast(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<ForecastDay[]> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_KEY}`;
  const { data } = await axios.get(url);
  // data.list contains 3-hour items. We'll pick unique dates and choose one.
  const map: Record<string, any[]> = {};
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    map[date] = map[date] || [];
    map[date].push(item);
  });
  const days = Object.keys(map).slice(0, 5).map(date => {
    const items = map[date];
    // pick the item closest to 12:00
    let chosen = items[Math.floor(items.length/2)];
    return {
      date,
      tempMin: Math.round(Math.min(...items.map((i:any) => i.main.temp_min))),
      tempMax: Math.round(Math.max(...items.map((i:any) => i.main.temp_max))),
      weather: chosen.weather[0].main,
      icon: chosen.weather[0].icon
    } as ForecastDay;
  });
  return days;
}

/**
 * Fetch news from NewsAPI using query keywords and category optionally
 * We limit to 20 articles
 */
export async function fetchNewsByQuery(q: string, pageSize = 20, category?: string): Promise<NewsArticle[]> {
  // NewsAPI example endpoint
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=${pageSize}&apiKey=${NEWSAPI_KEY}`;
  const { data } = await axios.get(url);
  return data.articles as NewsArticle[];
}
