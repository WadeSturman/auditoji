import React from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';

export default function MessageInput({ message, onChangeMessage, onSubmit }) {
  const handlePress = () => {};
  const [showConfirmation, setShowConfirmation] = React.useState(false);


  return (
    <View style={styles.inputRow}>
      <TextInput
        style={[styles.input, { backgroundColor: '#fff', color: '#000' }]}
        placeholder="What should Auditoji remind you to do?"
        placeholderTextColor="#999"
        value={message}
        onChangeText={onChangeMessage}
        returnKeyType="done" // changes the keyboard button
        onSubmitEditing={() => {
          handlePress();
          setShowConfirmation(true);
          setTimeout(() => setShowConfirmation(false), 1000);
          Keyboard.dismiss();
          onSubmit(); // ✅ this triggers handleSave from ReminderForm
        }}
      />
      {showConfirmation && (
        <Text style={styles.confirmation}> ✓ Added </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  confirmation: {
    color: 'green',
    fontSize: 14,
    marginTop: 4,
  },  
});
