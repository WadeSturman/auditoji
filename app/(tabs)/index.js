import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import ReminderForm from '../../components/ReminderForm';
import ReminderListItem from '../../components/ReminderListItem';
import {
  cancelReminderNotifications,
  rescheduleCustomReminders,
  scheduleReminder,
} from '../../utils/notifications';
import { loadReminders, saveReminders } from '../../utils/storage';

export default function ReminderScreen() {
  const navigation = useNavigation();
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: 'Auditoji' });
  }, [navigation]);

  // Load persisted reminders on mount and refresh custom-interval schedules.
  // Custom reminders only schedule 2 days ahead, so each app open extends the
  // window and re-attaches fresh notification IDs.
  useEffect(() => {
    async function init() {
      const stored = await loadReminders();
      const refreshed = await rescheduleCustomReminders(stored);
      setReminders(refreshed);
      await saveReminders(refreshed);
    }
    init();
  }, []);

  const handleSave = async (newReminder) => {
    const notificationIds = await scheduleReminder(newReminder);
    const reminderWithIds = { ...newReminder, notificationIds };
    const updated = [...reminders, reminderWithIds];
    setReminders(updated);
    await saveReminders(updated);
  };

  const handleDelete = async (id) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder?.notificationIds?.length) {
      await cancelReminderNotifications(reminder.notificationIds);
    }
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    await saveReminders(updated);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {Platform.OS === 'web' ? (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<ReminderForm onSave={handleSave} />}
          renderItem={({ item }) => (
            <ReminderListItem reminder={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
          ListEmptyComponent={<Text style={styles.emptyText}>No reminders yet.</Text>}
        />
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<ReminderForm onSave={handleSave} />}
            renderItem={({ item }) => (
              <ReminderListItem reminder={item} onDelete={handleDelete} />
            )}
            contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
            ListEmptyComponent={<Text style={styles.emptyText}>No reminders yet.</Text>}
          />
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    backgroundColor: '#fff',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
