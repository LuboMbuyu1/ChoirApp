import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import KeepAwake from 'react-native-keep-awake';
import { SongEntry } from '../types';
import { colors } from '../theme';
import { useSettingsStore } from '../store/settingsStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useSetlistStore } from '../store/setlistStore';
import { LyricsDisplay } from '../components/LyricsDisplay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { songsData } from '../utils/songs';
import type { SongDetailScreenProps, RootStackParamList } from '../types/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export const SongDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SongDetail'>>();
  const { song } = route.params;
  const { fontSize } = useSettingsStore();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const { addEntry } = useSetlistStore();

  useEffect(() => {
    KeepAwake.activate();
    return () => KeepAwake.deactivate();
  }, []);

  const fontSizeMap = {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 28,
  };

  const currentFontSize = fontSizeMap[fontSize];

const sameTypeSongs = useMemo(() => {
    const filtered = songsData.filter((s): s is SongEntry => s.type === song.type);
    if (song.type === 'song') {
      return filtered.sort((a, b) => (a.number || 0) - (b.number || 0));
    } else {
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [song.type]);

  const currentIndex = sameTypeSongs.findIndex((s) => s.id === song.id);
  const prevSong = currentIndex > 0 ? sameTypeSongs[currentIndex - 1] : null;
  const nextSong = currentIndex < sameTypeSongs.length - 1 ? sameTypeSongs[currentIndex + 1] : null;

  const handleBookmark = () => {
    if (isBookmarked(song.id)) {
      removeBookmark(song.id);
    } else {
      addBookmark(song.id);
    }
  };

  const handleShare = async () => {
    try {
      const message = `${song.title}${song.number ? ` (${song.number})` : ''}\n\n${song.type === 'song' ? song.verses.map((v: any) => `Verse ${v.number}:\n${v.text}`).join('\n\n') + (song.chorus ? `\n\nChorus:\n${song.chorus}` : '') : song.chorusText}`;
      await Share.share({ message });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleAddToSetlist = () => {
    addEntry(song);
    Alert.alert('Added to setlist', `${song.title} has been added to your setlist.`);
  };

  const navigateToSong = (targetSong: SongEntry) => {
    navigation.replace('SongDetail', { song: targetSong });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
            {song.number ? ` (${song.number})` : ''}
          </Text>
          {song.type === 'chorus' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>♪ Chorus</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
            <Ionicons
              name={isBookmarked(song.id) ? 'heart' : 'heart-outline'}
              size={24}
              color={isBookmarked(song.id) ? colors.danger : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddToSetlist} style={styles.actionButton}>
            <Ionicons name="list-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <LyricsDisplay song={song} fontSize={currentFontSize} isDark={false} />
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, !prevSong && styles.disabled]}
          onPress={() => prevSong && navigateToSong(prevSong)}
          disabled={!prevSong}
        >
          <Ionicons name="chevron-back" size={24} color={prevSong ? colors.primary : colors.textMuted} />
          <Text style={[styles.navText, !prevSong && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, !nextSong && styles.disabled]}
          onPress={() => nextSong && navigateToSong(nextSong)}
          disabled={!nextSong}
        >
          <Text style={[styles.navText, !nextSong && styles.disabledText]}>Next</Text>
          <Ionicons name="chevron-forward" size={24} color={nextSong ? colors.primary : colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.chorusBadge,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 16,
    color: colors.primary,
    marginHorizontal: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textMuted,
  },
});