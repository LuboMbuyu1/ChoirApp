import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SongEntry } from '../types';
import { colors } from '../theme';
import { useBookmarkStore } from '../store/bookmarkStore';
import { SongCard } from '../components/SongCard';
import { ChorusCard } from '../components/ChorusCard';
import { TypeFilter } from '../components/TypeFilter';
import { CategoryFilter } from '../components/CategoryFilter';
import { EmptyState } from '../components/EmptyState';
import Icon from 'react-native-vector-icons/Ionicons';
import { songsData } from '../utils/songs';
import type { HomeScreenProps } from '../types/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const HomeScreen: React.FC = () => {
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const [selectedType, setSelectedType] = useState<'song' | 'chorus'>('song');
  const [selectedCategory, setSelectedCategory] = useState('all');

const filteredSongs = useMemo(() => {
    let filtered = songsData.filter((song): song is SongEntry => song.type === selectedType);

    if (selectedCategory !== 'all') {
      if (['french', 'zulu', 'swahili', 'lingala', 'english'].includes(selectedCategory)) {
        filtered = filtered.filter((song): song is SongEntry => song.language === selectedCategory);
      } else {
        filtered = filtered.filter((song): song is SongEntry => song.category === selectedCategory);
      }
    }

    if (selectedType === 'song') {
      return filtered.sort((a, b) => (a.number || 0) - (b.number || 0));
    } else {
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [selectedType, selectedCategory]);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DCT Choir</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <TypeFilter selected={selectedType} onSelect={(type) => setSelectedType(type as 'song' | 'chorus')} />
      <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <FlatList
        data={filteredSongs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({ length: 72, offset: 72 * index, index })}
        initialNumToRender={20}
        ListEmptyComponent={
          <EmptyState
            icon="music-note-outline"
            title="No songs found"
            message="Try changing the type or category filter."
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
});