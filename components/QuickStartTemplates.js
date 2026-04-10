import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import soundLibrary from '../constants/sound-library';
import Touchable from './Touchable';

export default function QuickStartTemplates({ onSelect }) {
  return (
    <View>
      <Text style={styles.title}>Quick Start</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {soundLibrary.map((sound) => (
        <Touchable
          key={sound.id}
          style={styles.pill}
          onPress={() => onSelect(sound)}
        >
          <Text style={styles.pillText}>{sound.name}</Text>
        </Touchable>
      ))}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7B4FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    backgroundColor: '#EFEAFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  pillText: {
    color: '#7B4FFF',
    fontSize: 14,
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
});
