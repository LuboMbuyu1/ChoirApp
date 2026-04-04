import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SongEntry } from '../types';
import { colors } from '../theme';
import { useBookmarkStore } from '../store/bookmarkStore';
import { buildSearchIndex } from '../utils/searchUtils';
import { SongCard } from '../components/SongCard';
import { ChorusCard } from '../components/ChorusCard';
import { SearchBar } from '../components/SearchBar';
import { TypeFilter } from '../components/TypeFilter';
import { EmptyState } from '../components/EmptyState';
import { songsData } from '../utils/songs';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'song' | 'chorus' | 'all'>('all');

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(timer);
  }, [query]);

  const searchIndex = useMemo(() => buildSearchIndex(songsData), []);

const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const results = searchIndex.search(debouncedQuery);

    // Filter by type after search
    let filtered = results.map(r => r.item);
    if (selectedType !== 'all') {
      filtered = filtered.filter((item): item is SongEntry => item.type === selectedType);
    }

    // If query is a pure number, pin exact match to top
    if (/^\d+$/.test(debouncedQuery)) {
      const num = parseInt(debouncedQuery);
      const exactMatch = filtered.find(item => item.number === num);
      if (exactMatch) {
        filtered = [exactMatch, ...filtered.filter(item => item.id !== exactMatch.id)];
      }
    }

    return filtered;
  }, [debouncedQuery, selectedType, searchIndex]);

  const songCount = searchResults.filter(r => r.type === 'song').length;
  const chorusCount = searchResults.filter(r => r.type === 'chorus').length;

  const handleSongPress = (song: SongEntry) => {
    navigation.navigate('SongDetail', { song });
  };

  const handleBookmarkToggle = (song: SongEntry) => {
    if (isBookmarked(song.id)) {
      removeBookmark(song.id);
    } else {
      addBookmark(song.id);
    }
  };

  const renderItem = ({ item }: { item: SongEntry }) => {
    if (item.type === 'song') {
      return (
        <SongCard
          song={item}
          onPress={() => handleSongPress(item)}
          isBookmarked={isBookmarked(item.id)}
          onBookmarkToggle={() => handleBookmarkToggle(item)}
        />
      );
    } else {
      return (
        <ChorusCard
          chorus={item}
          onPress={() => handleSongPress(item)}
          isBookmarked={isBookmarked(item.id)}
          onBookmarkToggle={() => handleBookmarkToggle(item)}
        />
      );
    }
  };

  const getResultText = () => {
    if (songCount === 0 && chorusCount === 0) return '';
    if (selectedType === 'song') return `${songCount} song${songCount !== 1 ? 's' : ''}`;
    if (selectedType === 'chorus') return `${chorusCount} chorus${chorusCount !== 1 ? 'es' : ''}`;
    return `${songCount} song${songCount !== 1 ? 's' : ''} · ${chorusCount} chorus${chorusCount !== 1 ? 'es' : ''}`;
  };

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />
      <TypeFilter selected={selectedType} onSelect={setSelectedType} showAll />
      {debouncedQuery.trim() && (
        <Text style={styles.resultCount}>{getResultText()}</Text>
      )}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({ length: 72, offset: 72 * index, index })}
        initialNumToRender={20}
        ListEmptyComponent={
          debouncedQuery.trim() ? (
            <EmptyState
              icon="search"
              title="No results found"
              message={`No songs or choruses match "${debouncedQuery}". Try a different search term.`}
            />
          ) : (
            <EmptyState
              icon="search-outline"
              title="Search songs and choruses"
              message="Enter a title, number, or lyrics to find what you're looking for."
            />
          )
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
  resultCount: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 8,
  },
});