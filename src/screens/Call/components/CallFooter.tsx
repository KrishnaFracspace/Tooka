import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CallState } from '../../../types/call';

interface CallFooterProps {
  state: CallState;
  onRetry: () => void;
  onMessage: () => void;
  onClose: () => void;
}

export const CallFooter: React.FC<CallFooterProps> = React.memo(({ state, onRetry, onMessage, onClose }) => {
  if (state === CallState.MISSED || state === CallState.NO_ANSWER || state === CallState.FAILED || state === CallState.REJECTED) {
    return (
      <View style={styles.container}>
        <Pressable onPress={onClose} style={styles.secondaryButton}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
          <Text style={styles.secondaryText}>Back</Text>
        </Pressable>
        
        <View style={styles.primaryActions}>
          <Pressable onPress={onMessage} style={styles.iconButton}>
            <Ionicons name="chatbubble" size={24} color="#FFF" />
          </Pressable>
          <Pressable onPress={onRetry} style={styles.primaryButton}>
            <Text style={styles.primaryText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return null;
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },
  secondaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  primaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFB02E',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  primaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
