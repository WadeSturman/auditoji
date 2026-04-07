import React from 'react';
import { Text, View } from 'react-native';

function toInputValue(date) {
  if (!date) return '';
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export default function TimePickerRow({ label, time, onChange }) {
  const handleChange = (e) => {
    if (!e.target.value) return;
    const [hours, minutes] = e.target.value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;
    const next = new Date(time ?? new Date());
    next.setHours(hours, minutes, 0, 0);
    onChange(next);
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <input
        type="time"
        value={toInputValue(time)}
        onChange={handleChange}
        style={styles.input}
      />
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  label: {
    fontSize: 16,
    width: 90,
  },
  input: {
    fontSize: 16,
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #ccc',
    backgroundColor: '#EFEAFF',
    color: '#333',
    cursor: 'pointer',
  },
};
