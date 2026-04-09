import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const OPTIONS = ['Daily', 'Weekly', 'Weekdays Only', 'custom interval (minutes)'];

function isWeekdaysFreq(f) {
  return f === 'Weekdays Only' || f === 'Weekdays Only - Interval' || f === 'Weekdays Only - Time';
}

export default function FrequencySelector({ frequency, setFrequency, intervalMinutes, setIntervalMinutes }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Frequency</Text>
      <Picker
        selectedValue={isWeekdaysFreq(frequency) ? 'Weekdays Only' : frequency}
        onValueChange={(val) => setFrequency(val)}
        style={styles.picker}
      >
        {OPTIONS.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>

      {isWeekdaysFreq(frequency) && (
        <View style={styles.subOptions}>
          <label style={radioRowStyle}>
            <input
              type="radio"
              name="weekdays-sub"
              checked={frequency === 'Weekdays Only - Interval'}
              onChange={() => setFrequency('Weekdays Only - Interval')}
              style={{ accentColor: '#7B4FFF', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 15, color: '#333' }}>Choose Interval</span>
          </label>
          <label style={{ ...radioRowStyle, opacity: 0.45, cursor: 'default' }}>
            <input
              type="radio"
              name="weekdays-sub"
              disabled
              style={{ accentColor: '#7B4FFF', cursor: 'default' }}
            />
            <span style={{ fontSize: 15, color: '#333' }}>
              Choose a Time{' '}
              <em style={{ fontSize: 12, color: '#999' }}>(coming soon)</em>
            </span>
          </label>
        </View>
      )}

      {(frequency === 'custom interval (minutes)' || frequency === 'Weekdays Only - Interval') && (
        <TextInput
          style={styles.input}
          placeholder="How many minutes between reminders?"
          keyboardType="number-pad"
          value={intervalMinutes}
          onChangeText={setIntervalMinutes}
        />
      )}
    </View>
  );
}

// Plain object — used on HTML elements where StyleSheet refs don't apply.
const radioRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  subOptions: {
    gap: 10,
    paddingLeft: 4,
  },
});
