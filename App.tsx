import React from 'react';
import { AppProvider } from './src/contexts/AppProvider';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
