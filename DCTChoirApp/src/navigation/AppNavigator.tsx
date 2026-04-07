import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { SongDetailScreen } from '../screens/SongDetailScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { SetlistScreen } from '../screens/SetlistScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="SongDetail" component={SongDetailScreen} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="SongDetail" component={SongDetailScreen} />
  </Stack.Navigator>
);

interface AppNavigatorProps {
  isDark: boolean;
}

export default function AppNavigator({ isDark }: AppNavigatorProps) {
  const bg = isDark ? colors.backgroundDark : colors.background;
  const fg = isDark ? colors.textDark : colors.text;
  const surface = isDark ? colors.surfaceDark : colors.surface;
  const borderColor = isDark ? colors.borderDark : colors.border;
  const inactiveTint = isDark ? colors.textMutedDark : colors.textMuted;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            HomeTab:      ['home', 'home-outline'],
            SearchTab:    ['search', 'search-outline'],
            FavouritesTab:['heart', 'heart-outline'],
            SetlistTab:   ['list', 'list-outline'],
            SettingsTab:  ['settings', 'settings-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['help', 'help-outline'];
          return <Icon name={focused ? active : inactive} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: { backgroundColor: bg, borderTopColor: borderColor },
      })}
    >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ title: 'Home' }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{ title: 'Search' }}
        />
        <Tab.Screen
          name="FavouritesTab"
          component={BookmarksScreen}
          options={{ title: 'Favourites' }}
        />
        <Tab.Screen
          name="SetlistTab"
          component={SetlistScreen}
          options={{ title: 'Setlist' }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};