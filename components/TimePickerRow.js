import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TimePickerRow({ label, time, onPress }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onPress} style={styles.timeButton}>
        <Text style={styles.timeText}>
          {time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 8,
    gap: 12,
  },
  label: {
    fontSize: 16,
    width: 90,
  },
  timeText: {
    fontSize: 16,
    color: '#007AFF',
  },
  timeButton: {
    padding: 8, // makes tap area bigger
    borderRadius: 6,
    backgroundColor: '#EFEAFF',
  },
});