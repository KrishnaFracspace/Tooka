import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallContext } from '../../context/CallContext';
import { useMicrophonePermission } from '../../hooks/useMicrophonePermission';
import { CallState } from '../../types/call';

import { BackgroundOverlay } from './components/BackgroundOverlay';
import { CallHeader } from './components/CallHeader';
import { CallAvatar } from './components/CallAvatar';
import { CallStatus } from './components/CallStatus';
import { CallControls } from './components/CallControls';
import { IncomingActions } from './components/IncomingActions';
import { CallFooter } from './components/CallFooter';

export default function CallScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Extract request params if starting a new call
  const { bookingId, spaId, callType, spaName, spaAvatar, isIncoming } = (route.params as any) || {};

  const {
    callState,
    session,
    isMuted,
    isSpeaker,
    duration,
    initiateCall,
    acceptIncomingCall,
    declineIncomingCall,
    endCall,
    toggleMute,
    toggleSpeaker,
    errorMessage,
  } = useCallContext();

  const { requestPermission } = useMicrophonePermission();

  const initRef = useRef(false);

  // Initialize call if params exist and state is IDLE
  useEffect(() => {
    const start = async () => {
      if (initRef.current) return;
      initRef.current = true;

      const hasPerm = await requestPermission();
      if (!hasPerm) {
        Alert.alert('Permission Denied', 'Microphone permission is required for calls.');
        navigation.goBack();
        return;
      }
      if (callState === CallState.IDLE && bookingId && spaId && !isIncoming) {
        await initiateCall({ bookingId, spaId, callType: callType || 'voice' });
      }
    };
    start();
  }, [callState, bookingId, spaId, callType, isIncoming, initiateCall, requestPermission, navigation]);

  // Handle auto-close on IDLE
  useEffect(() => {
    if (callState === CallState.IDLE && !bookingId && !isIncoming) {
      // If idle and not trying to start a call, close screen
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [callState, bookingId, isIncoming, navigation]);

  const handleMinimize = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleRetry = () => {
    if (bookingId && spaId) initiateCall({ bookingId, spaId, callType: callType || 'voice' });
  };

  const handleMessage = () => {
    // Navigate to chat or open modal
    handleMinimize();
  };

  const displayName = session?.receiver?.name || spaName || 'Unknown User';
  const displayAvatar = session?.receiver?.avatarUrl || spaAvatar;

  return (
    <View style={styles.container}>
      <BackgroundOverlay avatarUrl={displayAvatar} />
      
      <CallHeader onMinimize={handleMinimize} />

      <View style={styles.content}>
        <View style={styles.spacer} />
        
        <CallAvatar name={displayName} avatarUrl={displayAvatar} state={callState} />
        <Text style={styles.nameLabel}>{displayName}</Text>
        <CallStatus state={callState} duration={duration} />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        
        <View style={styles.spacer} />
      </View>

      <View style={styles.bottomContainer}>
        {callState === CallState.INCOMING ? (
          <IncomingActions onAccept={acceptIncomingCall} onDecline={declineIncomingCall} />
        ) : (
          <>
            <CallControls
              state={callState}
              isMuted={isMuted}
              isSpeaker={isSpeaker}
              onMuteToggle={toggleMute}
              onSpeakerToggle={toggleSpeaker}
              onEndCall={endCall}
              onCancelCall={endCall}
            />
            <CallFooter
              state={callState}
              onRetry={handleRetry}
              onMessage={handleMessage}
              onClose={handleMinimize}
            />
          </>
        )}
      </View>
    </View>
  );
}

import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
  nameLabel: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: 20,
    alignItems: 'center',
  },
});
