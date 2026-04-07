import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function ReminderList({ reminders }) {
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };  
  const renderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderText}>{item.message}</Text>
      <Text style={styles.timeText}>
        {item.frequency === 'custom interval (minutes)'
          ? `Every ${item.intervalMinutes} minutes, from ${formatTime(item.startTime)} → ${formatTime(item.endTime)}`
          : `${formatTime(item.startTime)} - ${item.frequency}`}
      </Text>

      <Text style={styles.frequencyText}>
        {item.frequency === 'Every X minutes'
          ? `${item.frequency} (${item.intervalMinutes} mins)`
          : item.frequency}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={reminders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Active Reminders</Text>}
      ListEmptyComponent={<Text style={styles.emptyText}>No reminders yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    gap: 10, // helps space out items vertically
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  reminderItem: {
    backgroundColor: '#EFEAFF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  frequencyText: {
    fontSize: 14,
    color: '#999',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});