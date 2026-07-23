import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CallState } from '../../../types/call';
import { useCallTimer } from '../../../hooks/useCallTimer';

interface CallStatusProps {
  state: CallState;
  duration: number;
}

export const CallStatus: React.FC<CallStatusProps> = React.memo(({ state, duration }) => {
  const formattedTimer = useCallTimer(duration);

  const getStatusText = () => {
    switch (state) {
      case CallState.OUTGOING:
        return 'Calling...';
      case CallState.RINGING:
        return 'Ringing...';
      case CallState.INCOMING:
        return 'Incoming Call';
      case CallState.CONNECTING:
        return 'Connecting...';
      case CallState.CONNECTED:
        return formattedTimer;
      case CallState.RECONNECTING:
        return 'Reconnecting...';
      case CallState.MISSED:
        return 'Missed Call';
      case CallState.NO_ANSWER:
        return 'No Answer';
      case CallState.REJECTED:
        return 'Call Declined';
      case CallState.FAILED:
        return 'Call Failed';
      case CallState.ENDED:
        return `Call Ended • ${formattedTimer}`;
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{getStatusText()}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  statusText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '400',
  },
});
