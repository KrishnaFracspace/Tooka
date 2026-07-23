import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IncomingActionsProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingActions: React.FC<IncomingActionsProps> = React.memo(({ onAccept, onDecline }) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionItem}>
        <Pressable onPress={onDecline} style={[styles.button, styles.declineButton]}>
          <Ionicons name="close" size={32} color="#FFF" />
        </Pressable>
        <Text style={styles.label}>Decline</Text>
      </View>

      <View style={styles.actionItem}>
        <Pressable onPress={onAccept} style={[styles.button, styles.acceptButton]}>
          <Ionicons name="call" size={32} color="#FFF" />
        </Pressable>
        <Text style={styles.label}>Accept</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 60,
    marginBottom: 40,
  },
  actionItem: {
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
