// src/hooks/useLocation.ts
import { useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export function useLocation() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPermissionAndLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('Location permission denied');
            return;
          }
        }
        Geolocation.getCurrentPosition(
          pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          err => setError(err.message),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        );
      } catch (e: any) {
        setError(e.message);
      }
    };
    getPermissionAndLocation();
  }, []);

  return { location, error };
}
