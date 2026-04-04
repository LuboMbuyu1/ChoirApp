import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SongEntry } from '../types';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface SongCardProps {
  song: SongEntry;
  onPress: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onPress,
  isBookmarked,
  onBookmarkToggle,
}) => {
  const getLanguageBadgeColor = (language: string) => {
    switch (language) {
      case 'french': return colors.badge.french;
      case 'zulu': return colors.badge.zulu;
      case 'swahili': return colors.badge.swahili;
      case 'lingala': return colors.badge.lingala;
      case 'mixed': return colors.badge.mixed;
      default: return colors.primary;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.number}>{song.number}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
        {song.language !== 'english' && (
          <View style={[styles.badge, { backgroundColor: getLanguageBadgeColor(song.language) }]}>
            <Text style={styles.badgeText}>{song.language.toUpperCase()}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={onBookmarkToggle} style={styles.right}>
        <Ionicons
          name={isBookmarked ? 'heart' : 'heart-outline'}
          size={24}
          color={isBookmarked ? colors.danger : colors.textMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    width: 50,
    alignItems: 'center',
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  middle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  right: {
    width: 40,
    alignItems: 'center',
  },
});