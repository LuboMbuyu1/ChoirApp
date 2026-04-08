import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search',
  title,
  message,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={64} color={colors.textMuted} />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
});