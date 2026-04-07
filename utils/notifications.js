import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// When the app is in the foreground, suppress the system sound — we play it
// manually via expo-av so the correct per-reminder sound fires.
// When the app is backgrounded/killed, the OS handles the notification and
// plays whatever is in content.sound (requires a dev build for custom sounds).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function buildContent(reminder) {
  return {
    title: 'Auditoji',
    body: reminder.message,
    // soundId lets the foreground listener know which audio to play via expo-av.
    // sound is used by the OS when the app is backgrounded (dev build only).
    data: { reminderId: reminder.id, soundId: reminder.sound?.id ?? null },
    sound: reminder.sound?.soundFile ?? null,
  };
}

// Returns all future slots for a given day within the start→end window.
function getSlotsForDay(startHour, startMinute, endHour, endMinute, intervalMs, dayBase) {
  const slots = [];
  const now = Date.now();

  const windowStart = new Date(dayBase);
  windowStart.setHours(startHour, startMinute, 0, 0);

  const windowEnd = new Date(dayBase);
  windowEnd.setHours(endHour, endMinute, 0, 0);

  let cursor = windowStart.getTime();
  while (cursor <= windowEnd.getTime()) {
    if (cursor > now) {
      slots.push(new Date(cursor));
    }
    cursor += intervalMs;
  }

  return slots;
}

export async function scheduleReminder(reminder) {
  const startDate = new Date(reminder.startTime);
  const hour = startDate.getHours();
  const minute = startDate.getMinutes();
  const content = buildContent(reminder);
  const notificationIds = [];

  if (reminder.frequency === 'Daily') {
    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    notificationIds.push(id);

  } else if (reminder.frequency === 'Weekly') {
    // JS getDay() is 0–6 (Sun–Sat); Expo weekday is 1–7 (Sun–Sat)
    const weekday = startDate.getDay() + 1;
    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour,
        minute,
      },
    });
    notificationIds.push(id);

  } else if (reminder.frequency === 'custom interval (minutes)') {
    const intervalMs = parseInt(reminder.intervalMinutes, 10) * 60 * 1000;
    const endDate = new Date(reminder.endTime);
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    // Schedule today + tomorrow. The app reschedules on next open so custom
    // reminders stay active even if the phone is used for multiple days.
    for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
      const dayBase = new Date();
      dayBase.setDate(dayBase.getDate() + dayOffset);

      const slots = getSlotsForDay(hour, minute, endHour, endMinute, intervalMs, dayBase);
      for (const slot of slots) {
        const id = await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: slot,
          },
        });
        notificationIds.push(id);
      }
    }
  }

  return notificationIds;
}

export async function cancelReminderNotifications(notificationIds = []) {
  await Promise.all(
    notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id))
  );
}

// Called on app open to keep custom-interval reminders alive.
// Cancels stale notification IDs, reschedules for today+tomorrow, and
// returns the updated reminder array (caller must persist it).
// Sets up the foreground notification listener and returns a cleanup function.
// Extracted here so _layout.tsx never imports expo-notifications directly
// (the .web.js stub replaces this whole module on web).
export function setupForegroundListener(onNotification) {
  const subscription = Notifications.addNotificationReceivedListener(onNotification);
  return () => subscription.remove();
}

export async function rescheduleCustomReminders(reminders) {
  const customReminders = reminders.filter(
    (r) => r.frequency === 'custom interval (minutes)'
  );
  if (customReminders.length === 0) return reminders;

  const updated = await Promise.all(
    customReminders.map(async (reminder) => {
      await cancelReminderNotifications(reminder.notificationIds);
      const notificationIds = await scheduleReminder(reminder);
      return { ...reminder, notificationIds };
    })
  );

  return reminders.map((r) => updated.find((u) => u.id === r.id) ?? r);
}
