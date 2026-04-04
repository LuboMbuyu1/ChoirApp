import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SongEntry } from '../types';
import { colors } from '../theme';

interface LyricsDisplayProps {
  song: SongEntry;
  fontSize: number;
  isDark: boolean;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  song,
  fontSize,
  isDark,
}) => {
  const themeColors = isDark ? {
    background: colors.backgroundDark,
    text: colors.textDark,
    chorusBlock: colors.chorusBlockDark,
    textMuted: colors.textMutedDark,
  } : {
    background: colors.background,
    text: colors.text,
    chorusBlock: colors.chorusBlock,
    textMuted: colors.textMuted,
  };

  if (song.type === 'chorus') {
    return (
      <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.chorusText, { fontSize, color: themeColors.text, textAlign: 'center' }]}>
          {song.chorusText}
        </Text>
      </ScrollView>
    );
  }

  // For songs
  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {song.verses.map((verse) => (
        <View key={verse.number} style={styles.verseContainer}>
          <Text style={[styles.verseLabel, { fontSize: fontSize - 2, color: themeColors.textMuted }]}>
            Verse {verse.number}
          </Text>
          <Text style={[styles.verseText, { fontSize, color: themeColors.text }]}>
            {verse.text}
          </Text>
          {song.chorus && (
            <View style={[styles.chorusBlock, { backgroundColor: themeColors.chorusBlock }]}>
              <Text style={[styles.chorusLabel, { fontSize: fontSize - 2, color: themeColors.textMuted }]}>
                — Chorus —
              </Text>
              <Text style={[styles.chorusText, { fontSize, color: themeColors.text, fontStyle: 'italic' }]}>
                {song.chorus}
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  verseContainer: {
    marginBottom: 24,
  },
  verseLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  verseText: {
    lineHeight: 24,
    marginBottom: 16,
  },
  chorusBlock: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  chorusLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  chorusText: {
    lineHeight: 24,
  },
});