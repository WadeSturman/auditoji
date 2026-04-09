import { Audio } from 'expo-av';
import soundLibrary from '../constants/sound-library';

// Keyed by reminder.id → setTimeout return value.
// Lives in module scope for the lifetime of the browser tab.
const activeTimeouts = new Map();

// document.hasFocus() is unreliable in some browsers/environments.
// Track focus state explicitly via window events instead.
let isTabFocused = true;
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => { isTabFocused = true; });
  window.addEventListener('blur',  () => { isTabFocused = false; });
}

// --- Permissions ----------------------------------------------------------

export async function requestPermissions() {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// --- Fire a reminder (sound + browser notification) -----------------------

async function fireReminder(reminder) {
  // Sound via expo-av. Works as long as the user has interacted with the page
  // at least once (browser autoplay policy). Saving the reminder counts.
  const entry = soundLibrary.find((s) => s.id === reminder.sound?.id);
  if (entry) {
    try {
      const { sound } = await Audio.Sound.createAsync(entry.uri);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) sound.unloadAsync().catch(() => {});
      });
    } catch (e) {
      console.warn('[Auditoji] sound playback failed', e);
    }
  }

  if (isTabFocused) {
    // Chrome suppresses new Notification() when the tab is active. Show an
    // in-app banner instead by dispatching a custom event that _layout.tsx hears.
    window.dispatchEvent(new CustomEvent('auditoji-reminder', { detail: { message: reminder.message } }));
  } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('Auditoji', { body: reminder.message });
  }
}

// --- Scheduling helpers ---------------------------------------------------

// Returns milliseconds until the next time this reminder should fire,
// or null if there are no upcoming occurrences.
function msUntilNext(reminder) {
  const start = new Date(reminder.startTime);
  const hour = start.getHours();
  const minute = start.getMinutes();
  const now = Date.now();

  if (reminder.frequency === 'Daily') {
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next.getTime() <= now) next.setDate(next.getDate() + 1);
    return next.getTime() - now;
  }

  if (reminder.frequency === 'Weekly') {
    const targetDay = start.getDay(); // 0 = Sunday
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    let daysAhead = (targetDay - next.getDay() + 7) % 7;
    if (daysAhead === 0 && next.getTime() <= now) daysAhead = 7;
    next.setDate(next.getDate() + daysAhead);
    return next.getTime() - now;
  }

  if (reminder.frequency === 'custom interval (minutes)') {
    const end = new Date(reminder.endTime);
    const intervalMs = parseInt(reminder.intervalMinutes, 10) * 60 * 1000;

    for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
      const windowStart = new Date();
      windowStart.setDate(windowStart.getDate() + dayOffset);
      windowStart.setHours(hour, minute, 0, 0);

      const windowEnd = new Date(windowStart);
      windowEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

      let cursor = windowStart.getTime();
      while (cursor <= windowEnd.getTime()) {
        if (cursor > now) return cursor - now;
        cursor += intervalMs;
      }
    }
    return null;
  }

  return null;
}

// Schedules the next timeout for a reminder and stores its ID.
// After firing, re-calls itself so the reminder keeps repeating.
function scheduleNext(reminder) {
  const delay = msUntilNext(reminder);
  if (delay === null) return;

  const id = setTimeout(async () => {
    await fireReminder(reminder);
    scheduleNext(reminder); // chain to the next occurrence
  }, delay);

  activeTimeouts.set(reminder.id, id);
}

// --- Public API -----------------------------------------------------------

// Returns [reminder.id] as the web "notification ID" — this is the key used
// in activeTimeouts so cancelReminderNotifications can clear it.
export async function scheduleReminder(reminder) {
  const existing = activeTimeouts.get(reminder.id);
  if (existing != null) clearTimeout(existing);
  scheduleNext(reminder);
  return [reminder.id];
}

export async function cancelReminderNotifications(ids = []) {
  for (const id of ids) {
    const timeoutId = activeTimeouts.get(id);
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(id);
    }
  }
}

// On web, all scheduling is in-memory and lost on refresh, so reschedule
// every reminder on mount (not just custom-interval ones like native does).
export async function rescheduleCustomReminders(reminders) {
  for (const reminder of reminders) {
    const existing = activeTimeouts.get(reminder.id);
    if (existing != null) clearTimeout(existing);
    scheduleNext(reminder);
  }
  // Normalise notificationIds to the web format ([reminder.id]) so
  // cancelReminderNotifications can find the right timeout on delete.
  return reminders.map((r) => ({ ...r, notificationIds: [r.id] }));
}

// Sound is fired directly from the scheduler above; no separate foreground
// listener is needed on web.
export function setupForegroundListener() {
  return () => {};
}
