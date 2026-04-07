import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Touchable from '../../components/Touchable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/ui/AppHeader';
import soundLibrary from '../../constants/sound-library';

export default function SoundLibraryScreen() {
  const [sound, setSound] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };  


  const playSound = async (uri) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(uri);
    setSound(newSound);
    await newSound.playAsync();
  };

  const groupedSounds = soundLibrary.reduce((groups, item) => {
    const category = item.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <AppHeader />
      </View>
      <View style={styles.divider} />
      <Text style={styles.pageTitle}>Sound Library</Text>
      <Text style={styles.pageSubtitle}>Tap to preview sounds.</Text>
      <FlatList
        data={Object.entries(groupedSounds)}
        keyExtractor={([category]) => category}
        renderItem={({ item }) => {
          const [category, sounds] = item;
          const isExpanded = expandedCategories[category];
        
          return (
            <View>
              <Touchable onPress={() => toggleCategory(category)}>
                <Text style={styles.categoryHeader}>
                  {category} {isExpanded ? '▲' : '▼'}
                </Text>
              </Touchable>
        
              {isExpanded &&
                sounds.map((sound) => (
                  <Touchable
                    key={sound.id}
                    style={styles.soundItem}
                    onPress={() => playSound(sound.uri)}
                  >
                    <Text style={styles.soundName}>{sound.name}</Text>
                  </Touchable>
                ))}
            </View>
          );
        }} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  soundItem: {
    padding: 15,
    backgroundColor: '#EFEAFF',
    borderRadius: 8,
    marginBottom: 12,
  },
  soundName: {
    fontSize: 16,
    color: '#333',
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginTop: 20,
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7B4FFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7B4FFF',
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#7B4FFF',
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  headerWrapper: {
    marginTop: 10, // tweak this value until visually aligned
  },   
});