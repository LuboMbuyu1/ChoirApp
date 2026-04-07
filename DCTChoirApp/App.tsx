import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { useSettingsStore } from './src/store/settingsStore';

export default function App() {
  const systemScheme = useColorScheme();
  const { theme } = useSettingsStore();
  const isDark =
    theme === 'dark' ? true :
    theme === 'light' ? false :
    systemScheme === 'dark';

  return (
    <NavigationContainer>
      <AppNavigator isDark={isDark} />
    </NavigationContainer>
  );
}
