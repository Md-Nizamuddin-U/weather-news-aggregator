import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppProvider';

const NEWS_CATEGORIES = [
  'General',
  'Business',
  'Technology',
  'Sports',
  'Entertainment',
  'Health',
  'Science'
];

export default function SettingsScreen() {
  const { state, dispatch } = useAppContext();

  // Temperature unit state
  const [units, setUnits] = useState(state.units === 'metric');

  // News categories state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(state.newsCategories || ['General']);

  const toggleUnits = () => {
    const newUnit = units ? 'imperial' : 'metric';
    dispatch({ type: 'SET_UNITS', payload: newUnit });
    setUnits(!units);
  };

  const toggleCategory = (category: string) => {
    let updated: string[] = [];
    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter(c => c !== category);
    } else {
      updated = [...selectedCategories, category];
    }
    setSelectedCategories(updated);
  };

  const saveSettings = () => {
    dispatch({ type: 'SET_CATEGORIES', payload: selectedCategories });
    Alert.alert('Settings Saved', 'Your preferences have been updated.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>News Categories</Text>
          <Text style={styles.cardText}>Select the news categories you are interested in:</Text>
          <View style={styles.categoriesContainer}>
            {NEWS_CATEGORIES.map(category => {
              const selected = selectedCategories.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, selected && styles.categorySelected]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{category}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
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
  cardText: { fontSize: 14, color: '#bbb', marginBottom: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  switchLabel: { fontSize: 14, color: '#fff', marginHorizontal: 4 },
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#555'
  },
  categorySelected: { backgroundColor: '#1E90FF', borderColor: '#1E90FF' },
  categoryText: { color: '#aaa', fontSize: 14 },
  categoryTextSelected: { color: '#fff', fontWeight: '700' },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
