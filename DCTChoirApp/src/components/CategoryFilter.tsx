import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  'All',
  'Praise',
  'Worship',
  'Hymn',
  'Evangelism',
  'Second Coming',
  'Prayer',
  'Christmas',
  'General',
  'French',
  'Zulu',
  'Swahili',
  'Lingala',
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.chip,
            selectedCategory === category.toLowerCase() ? styles.selected : styles.unselected,
          ]}
          onPress={() => onSelectCategory(category.toLowerCase())}
        >
          <Text
            style={[
              styles.text,
              selectedCategory === category.toLowerCase() ? styles.selectedText : styles.unselectedText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  unselected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 14,
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: colors.text,
  },
});