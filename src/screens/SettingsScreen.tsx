import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppProvider';

export default function SettingsScreen() {
  const { state, dispatch } = useAppContext();
  const [units, setUnits] = useState(state.units === 'metric');

  const toggleUnits = () => {
    const newUnit = units ? 'imperial' : 'metric';
    dispatch({ type: 'SET_UNITS', payload: newUnit });
    setUnits(!units);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Temperature Units */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Temperature Units</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Celsius</Text>
          <Switch
            value={state.units === 'metric'}
            onValueChange={toggleUnits}
            thumbColor="#1E90FF"
            trackColor={{ false: '#555', true: '#1E90FF' }}
          />
          <Text style={styles.switchLabel}>{state.units === 'metric' ? 'Metric (°C)' : 'Imperial (°F)'}</Text>
        </View>
      </View>

      {/* News Categories */}
      {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>News Categories</Text>
        <Text style={styles.cardText}>
          You can add UI to select categories like Business, Sports, Technology. Default is General.
        </Text>
      </View> */}

      {/* <Button
        title="Save"
        onPress={() => Alert.alert('Settings Saved', 'Your preferences have been updated.')}
        color="#1E90FF"
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#1E90FF' },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#fff' },
  cardText: { fontSize: 14, color: '#bbb' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  switchLabel: { fontSize: 14, color: '#fff', marginHorizontal: 4 }
});
