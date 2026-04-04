import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface TypeFilterProps {
  selected: 'song' | 'chorus' | 'all';
  onSelect: (type: 'song' | 'chorus' | 'all') => void;
  showAll?: boolean;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({
  selected,
  onSelect,
  showAll = false,
}) => {
  const options = showAll ? ['all', 'song', 'chorus'] : ['song', 'chorus'];

  return (
    <View style={styles.container}>
      {options.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.button,
            selected === type ? styles.selected : styles.unselected,
          ]}
          onPress={() => onSelect(type as 'song' | 'chorus' | 'all')}
        >
          <Text
            style={[
              styles.text,
              selected === type ? styles.selectedText : styles.unselectedText,
            ]}
          >
            {type === 'song' ? 'Songs' : type === 'chorus' ? 'Choruses' : 'All'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  unselected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: colors.primary,
  },
});