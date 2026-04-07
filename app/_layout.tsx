import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';
import soundLibrary from '../constants/sound-library';
import { requestPermissions, setupForegroundListener } from '../utils/notifications';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    requestPermissions();

    const cleanup = setupForegroundListener(async (notification) => {
      const soundId = notification.request.content.data?.soundId;
      if (!soundId) return;

      const entry = soundLibrary.find((s) => s.id === soundId);
      if (!entry) return;

      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(entry.uri);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (e) {
        console.warn('Failed to play notification sound:', e);
      }
    });

    return cleanup;
  }, []);

  // On web, system notifications are suppressed when the tab is focused.
  // The scheduler dispatches 'auditoji-reminder' instead — we show a banner.
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let dismissTimer: ReturnType<typeof setTimeout>;

    const handler = (e: Event) => {
      const message = (e as CustomEvent<{ message: string }>).detail.message;
      setBanner(message);
      clearTimeout(dismissTimer);
      dismissTimer = setTimeout(() => setBanner(null), 5000);
    };

    window.addEventListener('auditoji-reminder', handler);
    return () => {
      window.removeEventListener('auditoji-reminder', handler);
      clearTimeout(dismissTimer);
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      {banner && (
        <View style={styles.banner} pointerEvents="none">
          <Text style={styles.bannerTitle}>Auditoji</Text>
          <Text style={styles.bannerMessage}>{banner}</Text>
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#7B4FFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 9999,
  },
  bannerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 2,
    opacity: 0.85,
  },
  bannerMessage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
