import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SongEntry } from '../types';
import { colors } from '../theme';
import { useBookmarkStore } from '../store/bookmarkStore';
import { SongCard } from '../components/SongCard';
import { ChorusCard } from '../components/ChorusCard';
import { TypeFilter } from '../components/TypeFilter';
import { EmptyState } from '../components/EmptyState';
import { songsData } from '../utils/songs';
import type { HomeTabScreenProps } from '../types/navigation';

export const BookmarksScreen: React.FC = () => {
// navigation typing handled by store
  const { bookmarkedIds, addBookmark, removeBookmark } = useBookmarkStore();
  const [selectedType, setSelectedType] = useState<'song' | 'chorus' | 'all'>('all');

  const bookmarkedSongs = useMemo(() => {
    let bookmarks = songsData.filter((song): song is SongEntry => bookmarkedIds.includes(song.id));

    if (selectedType !== 'all') {
      bookmarks = bookmarks.filter((song): song is SongEntry => song.type === selectedType);
    }

    // Sort: songs by number, choruses by title
    const songs = bookmarks.filter((s): s is SongEntry => s.type === 'song').sort((a, b) => (a.number || 0) - (b.number || 0));
    const choruses = bookmarks.filter((s): s is SongEntry => s.type === 'chorus').sort((a, b) => a.title.localeCompare(b.title));

    return [...songs, ...choruses];
  }, [bookmarkedIds, selectedType]);

  const handleSongPress = (song: SongEntry) => {
    navigation.navigate('SongDetail', { song });
  };

  const handleBookmarkToggle = (song: SongEntry) => {
    removeBookmark(song.id);
  };

  const renderItem = ({ item }: { item: SongEntry }) => {
    if (item.type === 'song') {
      return (
        <SongCard
          song={item}
          onPress={() => handleSongPress(item)}
          isBookmarked={true}
          onBookmarkToggle={() => handleBookmarkToggle(item)}
        />
      );
    } else {
      return (
        <ChorusCard
          chorus={item}
          onPress={() => handleSongPress(item)}
          isBookmarked={true}
          onBookmarkToggle={() => handleBookmarkToggle(item)}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favourites</Text>
      </View>
      <TypeFilter selected={selectedType} onSelect={setSelectedType} showAll />
      <FlatList
        data={bookmarkedSongs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({ length: 72, offset: 72 * index, index })}
        initialNumToRender={20}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favourites yet"
            message="Bookmark songs and choruses to see them here."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
});