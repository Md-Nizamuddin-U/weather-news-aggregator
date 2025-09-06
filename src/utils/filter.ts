export function mapWeatherToQuery(mainWeather: string, temp: number, units: 'metric' | 'imperial') {
  // Use temp thresholds; metric: cold < 10, hot > 28, else cool
  const tempC = units === 'metric' ? temp : (temp - 32) * (5/9);
  const w = mainWeather?.toLowerCase() || '';

  if (tempC <= 10 || w.includes('snow') || w.includes('rain') || w.includes('drizzle')) {
    // cold -> depressing
    return 'disaster OR death OR tragedy OR crisis OR unemployment OR "economic downturn"';
  } else if (tempC >= 28 || w.includes('clear') && tempC >= 25) {
    // hot -> fear
    return 'attack OR terror OR panic OR "state of emergency" OR war OR "security threat"';
  } else {
    // cool -> winning/happiness
    return 'win OR victory OR success OR award OR "celebration" OR "good news"';
  }
}
