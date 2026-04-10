import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Touchable from './Touchable';
import { SafeAreaView } from 'react-native-safe-area-context';
import soundLibrary from '../constants/sound-library';
import FrequencySelector from './FrequencySelector';
import MessageInput from './MessageInput';
import SaveReminderButton from './SaveReminderButton';
import TimePickerRow from './TimePickerRow';
import AppHeader from './ui/AppHeader';
import QuickStartTemplates from './QuickStartTemplates';

export default function ReminderForm({ onSave }) {
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [frequency, setFrequency] = useState('custom interval (minutes)');
  const [intervalMinutes, setIntervalMinutes] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState(null);
  const [suggestedSound, setSuggestedSound] = useState(null);
  const [selectedSound, setSelectedSound] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showManualSoundPicker, setShowManualSoundPicker] = useState(false);

  const detectSoundFromMessage = (text) => {
    const lower = text.toLowerCase();
    for (let sound of soundLibrary) {
      if (sound.keywords && sound.keywords.some((kw) => lower.includes(kw))) {
        return sound;
      }
    }
    return null;
  };

  const handleTemplateSelect = (sound) => {
    setMessage(sound.name);
    setSelectedSound(sound);
  };

  const resetForm = () => {
    setMessage('');
    setIntervalMinutes('');
    setSelectedSound(null);
    setSuggestedSound(null);
    setShowManualSoundPicker(false);
    setModalVisible(false);
  };

  const saveReminder = (sound = selectedSound) => {
    const reminder = {
      id: Date.now().toString(),
      message,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      frequency,
      intervalMinutes: frequency === 'custom interval (minutes)' ? intervalMinutes : null,
      sound,
    };
    onSave(reminder);
    Alert.alert('Saved!', 'Reminder saved successfully.');
    resetForm();
  };

  const handleSave = () => {
    if (!message.trim()) {
      Alert.alert('Reminder message required');
      return;
    }

    if (!selectedSound) {
      const match = detectSoundFromMessage(message);
      if (match) {
        setSuggestedSound(match);
        setModalVisible(true);
        return;
      } else {
        setShowManualSoundPicker(true);
        return;
      }
    }

    saveReminder();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerWrapper}>
          <AppHeader />
        </View>
        <View style={styles.divider} />
        <QuickStartTemplates onSelect={handleTemplateSelect} />
        <Text style={styles.title}>Create a Reminder</Text>

        <MessageInput
          message={message}
          onChangeMessage={setMessage}
          onSubmit={handleSave}
        />

        <TimePickerRow
          label="Start Time:"
          time={startTime}
          onPress={() => {
            setPickerMode('start');
            setPickerVisible(true);
          }}
          onChange={setStartTime}
        />

        <TimePickerRow
          label="End Time:"
          time={endTime}
          onPress={() => {
            setPickerMode('end');
            setPickerVisible(true);
          }}
          onChange={setEndTime}
        />

        <FrequencySelector
          frequency={frequency}
          setFrequency={setFrequency}
          intervalMinutes={intervalMinutes}
          setIntervalMinutes={setIntervalMinutes}
        />

        {selectedSound && (
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>
            ✅ Selected Sound: {selectedSound.name}
          </Text>
        )}

        <SaveReminderButton onPress={handleSave} disabled={!message.trim()} />

        <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={() => {}}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Suggested Sound</Text>
              <Text style={styles.modalText}>We found a sound that fits this reminder:</Text>
              <Text style={styles.modalSoundName}>{suggestedSound?.name}</Text>

              <View style={styles.modalButtons}>
                <Touchable
                  style={styles.modalButton}
                  onPress={() => { setSelectedSound(suggestedSound); setModalVisible(false); saveReminder(suggestedSound); }}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </Touchable>

                <Touchable
                  style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                  onPress={() => { setModalVisible(false); setShowManualSoundPicker(true); }}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </Touchable>
              </View>
            </View>
          </View>
        </Modal>

        {showManualSoundPicker && (
          <View>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Select a sound manually:</Text>
            {soundLibrary.map((sound) => (
              <Touchable
                key={sound.id}
                onPress={() => {
                  setSelectedSound(sound);
                  setShowManualSoundPicker(false);
                  saveReminder(sound);
                }}
                style={{ paddingVertical: 10 }}
              >
                <Text>{sound.name}</Text>
              </Touchable>
            ))}
          </View>
        )}

        {Platform.OS !== 'web' && (
          <DateTimePickerModal
            isVisible={isPickerVisible}
            mode="time"
            onConfirm={(date) => {
              if (pickerMode === 'start') setStartTime(date);
              else if (pickerMode === 'end') setEndTime(date);
              setPickerVisible(false);
              setPickerMode(null);
            }}
            onCancel={() => {
              setPickerVisible(false);
              setPickerMode(null);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
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
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSoundName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: '#7B4FFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    backgroundColor: '#7B4FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});