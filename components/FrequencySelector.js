import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

const FREQUENCIES = ['Daily', 'Weekly', 'Weekdays Only', 'custom interval (minutes)'];

function isWeekdaysFreq(f) {
  return f === 'Weekdays Only' || f === 'Weekdays Only - Interval' || f === 'Weekdays Only - Time';
}

export default function FrequencySelector({ frequency, setFrequency, intervalMinutes, setIntervalMinutes }) {
  const [modalVisible, setModalVisible] = useState(false);
  const displayLabel = isWeekdaysFreq(frequency) ? 'Weekdays Only' : (frequency || 'Select frequency');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Frequency</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.pickerTouchable}
      >
        <View style={styles.pickerContent}>
          <Text style={styles.pickerText}>{displayLabel}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </View>
      </TouchableOpacity>

      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          {FREQUENCIES.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setFrequency(option);
                setModalVisible(false);
              }}
              style={styles.modalOption}
            >
              <Text style={styles.modalText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {isWeekdaysFreq(frequency) && (
        <View style={styles.subOptions}>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setFrequency('Weekdays Only - Interval')}
          >
            <View style={[styles.radioCircle, frequency === 'Weekdays Only - Interval' && styles.radioSelected]} />
            <Text style={styles.radioLabel}>Choose Interval</Text>
          </TouchableOpacity>
          <View style={styles.radioRow}>
            <View style={styles.radioCircle} />
            <Text style={[styles.radioLabel, styles.radioDisabled]}>
              Choose a Time{' '}
              <Text style={styles.comingSoon}>(coming soon)</Text>
            </Text>
          </View>
        </View>
      )}

      {(frequency === 'custom interval (minutes)' || frequency === 'Weekdays Only - Interval') && (
        <TextInput
          style={styles.input}
          placeholder="How many minutes between reminders?"
          keyboardType="number-pad"
          returnKeyType="done"
          value={intervalMinutes}
          onChangeText={setIntervalMinutes}
          onSubmitEditing={Keyboard.dismiss}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  pickerTouchable: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  modalOption: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#000',
  },
  pickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  subOptions: {
    gap: 10,
    paddingLeft: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#7B4FFF',
    backgroundColor: 'transparent',
  },
  radioSelected: {
    backgroundColor: '#7B4FFF',
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
  },
  radioDisabled: {
    color: '#aaa',
  },
  comingSoon: {
    fontSize: 12,
    color: '#bbb',
    fontStyle: 'italic',
  },
});
