import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const OPTIONS = ['Daily', 'Weekly', 'custom interval (minutes)'];

export default function FrequencySelector({ frequency, setFrequency, intervalMinutes, setIntervalMinutes }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Frequency</Text>
      <Picker
        selectedValue={frequency}
        onValueChange={setFrequency}
        style={styles.picker}
      >
        {OPTIONS.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
      {frequency === 'custom interval (minutes)' && (
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
});
