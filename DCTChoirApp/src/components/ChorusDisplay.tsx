import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SongEntry } from '../types';
import { colors } from '../theme';

interface ChorusDisplayProps {
  chorus: SongEntry;
  fontSize: number;
  isDark: boolean;
}

export const ChorusDisplay: React.FC<ChorusDisplayProps> = ({
  chorus,
  fontSize,
  isDark,
}) => {
  const themeColors = isDark ? {
    background: colors.backgroundDark,
    text: colors.textDark,
  } : {
    background: colors.background,
    text: colors.text,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.chorusText, { fontSize, color: themeColors.text }]}>
        {chorus.chorusText}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chorusText: {
    lineHeight: 24,
    textAlign: 'center',
  },
});