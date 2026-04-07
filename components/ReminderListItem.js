import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Touchable from './Touchable';

export default function ReminderListItem({ reminder, onDelete }) {
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const getDayOfWeek = (time) =>
    new Date(time).toLocaleDateString(undefined, { weekday: 'long' });

  return (
    <View style={styles.reminderItem}>
      <View style={styles.headerRow}>
        <Text style={styles.reminderText}>{reminder.message}</Text>
        <Touchable onPress={() => onDelete(reminder.id)}>
          <Text style={styles.deleteText}>✕</Text>
        </Touchable>
      </View>
      <Text style={styles.timeText}>
        {reminder.frequency === 'custom interval (minutes)'
          ? `Every ${reminder.intervalMinutes} minutes, from ${formatTime(reminder.startTime)} → ${formatTime(reminder.endTime)}`
          : reminder.frequency === 'Weekly'
            ? `${getDayOfWeek(reminder.startTime)} at ${formatTime(reminder.startTime)}`
            : `${formatTime(reminder.startTime)} - Daily`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reminderItem: {
    backgroundColor: '#EFEAFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  deleteText: {
    fontSize: 16,
    color: '#D00',
    paddingLeft: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
