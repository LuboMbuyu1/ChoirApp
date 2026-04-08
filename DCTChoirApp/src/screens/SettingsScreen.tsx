import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useSetlistStore } from '../store/setlistStore';
import { colors } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const SettingsScreen: React.FC = () => {
  const { fontSize, theme, setFontSize, setTheme } = useSettingsStore();
  const { clearAll: clearBookmarks } = useBookmarkStore();
  const { clear: clearSetlist } = useSetlistStore();

  const fontSizes = [
    { key: 'small', label: 'Small', size: 16 },
    { key: 'medium', label: 'Medium', size: 20 },
    { key: 'large', label: 'Large', size: 24 },
    { key: 'xlarge', label: 'Extra Large', size: 28 },
  ];

  const themes = [
    { key: 'system', label: 'System' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
  ];

  const handleClearBookmarks = () => {
    Alert.alert(
      'Clear bookmarks',
      'Are you sure you want to clear all bookmarks?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearBookmarks },
      ]
    );
  };

  const handleClearSetlist = () => {
    Alert.alert(
      'Clear setlist',
      'Are you sure you want to clear your setlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearSetlist },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Size</Text>
        {fontSizes.map((size) => (
          <TouchableOpacity
            key={size.key}
            style={[styles.option, fontSize === size.key && styles.selectedOption]}
            onPress={() => setFontSize(size.key as any)}
          >
            <Text style={[styles.optionText, fontSize === size.key && styles.selectedText]}>
              {size.label}
            </Text>
            <Text style={[styles.optionPreview, { fontSize: size.size }]}>
              Only believe
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        {themes.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.option, theme === t.key && styles.selectedOption]}
            onPress={() => setTheme(t.key as any)}
          >
            <Text style={[styles.optionText, theme === t.key && styles.selectedText]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.destructiveOption} onPress={handleClearBookmarks}>
          <Ionicons name="heart-dislike-outline" size={20} color={colors.danger} />
          <Text style={styles.destructiveText}>Clear all bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.destructiveOption} onPress={handleClearSetlist}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={styles.destructiveText}>Clear setlist</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>App Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Choirbook</Text>
          <Text style={styles.aboutValue}>DCT Choirbook V5</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  optionPreview: {
    color: colors.textMuted,
  },
  destructiveOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  destructiveText: {
    fontSize: 16,
    color: colors.danger,
    marginLeft: 12,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 16,
    color: colors.text,
  },
  aboutValue: {
    fontSize: 16,
    color: colors.textMuted,
  },
});