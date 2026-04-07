import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';


export default function FrequencySelector({ frequency, setFrequency, intervalMinutes, setIntervalMinutes }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Frequency</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.pickerTouchable}
      >
        <View style={styles.pickerContent}>
          <Text style={styles.pickerText}>{frequency || 'Select frequency'}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </View>
      </TouchableOpacity>


      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
        {['Daily', 'Weekly', 'custom interval (minutes)'].map((option) => (
          <TouchableOpacity
            key={option} // ✅ fixes the warning
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
      {frequency === 'custom interval (minutes)' && (
        <TextInput
          style={styles.input}
          placeholder="How many minutes between reminders?"
          keyboardType="number-pad" // or "decimal-pad" if you want to allow decimals
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
    paddingHorizontal: 4, // optional tweak
  },     
});
