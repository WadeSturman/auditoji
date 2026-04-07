# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start the dev server (choose iOS simulator, Android emulator, or Expo Go)
npx expo start

# Run on specific platform
npm run ios
npm run android
npm run web

# Lint
npm run lint
```

There is no test suite configured.

## Architecture

Auditoji is an Expo (React Native) app for creating auditory reminders. Users compose a reminder message, pick a time window and frequency, and the app associates a sound file from the library with that reminder.

**Routing** — File-based via `expo-router`. Two tabs defined in `app/(tabs)/_layout.tsx`:
- `app/(tabs)/index.js` — Reminders screen (create + list reminders)
- `app/(tabs)/sound-library.js` — Browse and preview all sounds by category

**Reminder flow** — `ReminderForm` (the main form component) handles the full save flow:
1. User types a message → on save, keywords in the message are matched against `soundLibrary[].keywords`
2. If a match is found, a modal suggests the sound; user can accept or pick manually
3. If no match, a manual sound picker is shown inline
4. On confirm, `onSave(reminder)` is called and state is held in the parent (`index.js`) via `useState` — there is no persistent storage yet

**Sound library** — `constants/sound-library.js` is the single source of truth: an array of objects with `{ id, name, uri, category, keywords }`. Audio files live in `assets/sounds/`. Playback uses `expo-av`.

**Key components**
- `ReminderForm.js` — orchestrates the entire create-reminder UX including modals and sound selection
- `ReminderListItem.js` — display-only card for a saved reminder
- `FrequencySelector.js` — picker for Daily / Weekly / custom interval (minutes)
- `TimePickerRow.js` — wraps `react-native-modal-datetime-picker`
- `components/ui/AppHeader.js` — shared branded header used on both screens

**Styling** — Inline `StyleSheet.create` per file; brand color is `#7B4FFF` (purple).

**Important limitation** — Reminders are stored only in React state and are lost on app restart. Scheduling/notifications are not yet implemented.
