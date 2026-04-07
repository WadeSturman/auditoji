import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Touchable from './Touchable';

export default function SaveReminderButton({ onPress, disabled }) {
  return (
    <Touchable
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>Save Reminder</Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7B4FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabled: {
    backgroundColor: '#C9BAFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
