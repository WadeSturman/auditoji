import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AppHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.appTitle}>Auditoji</Text>
      <Text style={styles.subtitle}>
        build habits with auditory reminders.{"\n"}sound is fun!
      </Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7B4FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    lineHeight: 20,
  },
  divider: {
    marginTop: 12,
    height: 2,
    backgroundColor: '#7B4FFF',
    marginHorizontal: 30,
  },  
});
