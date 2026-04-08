import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useNavigation } from '@react-navigation/native';
import { SongEntry } from '../types';
import { colors } from '../theme';
import { useSetlistStore } from '../store/setlistStore';
import { SongCard } from '../components/SongCard';
import { ChorusCard } from '../components/ChorusCard';
import { EmptyState } from '../components/EmptyState';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const SetlistScreen: React.FC = () => {
  const navigation = useNavigation();
  const { entries, reorder, removeEntry, clear } = useSetlistStore();
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const handleClear = () => {
    Alert.alert(
      'Clear setlist',
      'Are you sure you want to clear your entire setlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clear },
      ]
    );
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<SongEntry>) => {
    if (item.type === 'song') {
      return (
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[styles.listItem, isActive && styles.activeItem]}
        >
          <View style={styles.dragHandle}>
            <Ionicons name="menu" size={20} color={colors.textMuted} />
          </View>
          <View style={styles.cardContainer}>
            <SongCard
              song={item}
              onPress={() => {}}
              isBookmarked={false}
              onBookmarkToggle={() => {}}
            />
          </View>
          <TouchableOpacity
            onPress={() => removeEntry(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="close" size={20} color={colors.danger} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[styles.listItem, isActive && styles.activeItem]}
        >
          <View style={styles.dragHandle}>
            <Ionicons name="menu" size={20} color={colors.textMuted} />
          </View>
          <View style={styles.cardContainer}>
            <ChorusCard
              chorus={item}
              onPress={() => {}}
              isBookmarked={false}
              onBookmarkToggle={() => {}}
            />
          </View>
          <TouchableOpacity
            onPress={() => removeEntry(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="close" size={20} color={colors.danger} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }
  };

  if (isPresentationMode && entries.length > 0) {
    return <PresentationMode entries={entries} onExit={() => setIsPresentationMode(false)} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setlist</Text>
        <View style={styles.headerActions}>
          {entries.length > 0 && (
            <>
              <TouchableOpacity onPress={handleClear} style={styles.headerButton}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPresentationMode(true)} style={styles.headerButton}>
                <Ionicons name="play" size={20} color={colors.primary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <DraggableFlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ from, to }) => reorder(from, to)}
        getItemLayout={(data, index) => ({ length: 72, offset: 72 * index, index })}
        ListEmptyComponent={
          <EmptyState
            icon="list-outline"
            title="No setlist items"
            message="Add songs and choruses from the detail screen to create your setlist."
          />
        }
      />
    </View>
  );
};

const PresentationMode: React.FC<{ entries: SongEntry[]; onExit: () => void }> = ({ entries, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentEntry = entries[currentIndex];

  const next = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.presentationContainer}>
      <TouchableOpacity onPress={onExit} style={styles.exitButton}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.presentationContent}>
        <Text style={styles.presentationTitle}>
          {currentEntry.title}
          {currentEntry.number ? ` (${currentEntry.number})` : ''}
        </Text>
        <Text style={styles.presentationText}>
          {currentEntry.type === 'song'
            ? currentEntry.verses.map(v => `Verse ${v.number}:\n${v.text}`).join('\n\n') +
              (currentEntry.chorus ? `\n\nChorus:\n${currentEntry.chorus}` : '')
            : currentEntry.chorusText}
        </Text>
      </View>
      <View style={styles.presentationControls}>
        <TouchableOpacity onPress={prev} disabled={currentIndex === 0} style={styles.controlButton}>
          <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? colors.textMuted : 'white'} />
        </TouchableOpacity>
        <Text style={styles.presentationCounter}>{currentIndex + 1} / {entries.length}</Text>
        <TouchableOpacity onPress={next} disabled={currentIndex === entries.length - 1} style={styles.controlButton}>
          <Ionicons name="chevron-forward" size={24} color={currentIndex === entries.length - 1 ? colors.textMuted : 'white'} />
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activeItem: {
    backgroundColor: colors.primaryLight,
  },
  dragHandle: {
    padding: 16,
  },
  chorusIcon: {
    fontSize: 18,
    color: colors.primary,
    marginRight: 8,
  },
  cardContainer: {
    flex: 1,
  },
  removeButton: {
    padding: 16,
  },
  presentationContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  exitButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  presentationContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  presentationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
  },
  presentationText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
  },
  presentationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 50,
  },
  controlButton: {
    padding: 16,
  },
  presentationCounter: {
    fontSize: 16,
    color: 'white',
  },
});