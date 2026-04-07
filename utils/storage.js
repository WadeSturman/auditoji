import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDERS_KEY = '@auditoji_reminders';

export async function saveReminders(reminders) {
  await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export async function loadReminders() {
  const data = await AsyncStorage.getItem(REMINDERS_KEY);
  return data ? JSON.parse(data) : [];
}
