import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { CallState, CallSession } from '../types/call';
import { socketService } from '../services/call/socketService';
import { callService } from '../services/call/callService';
import { agoraService } from '../services/call/agoraService';
import { callManager } from '../services/call/callManager';
import { AGORA_CONFIG } from '../config/agora';
import { callLogger, ENABLE_CALL_DIAGNOSTICS } from '../services/call/callLogger';

interface CallContextType {
  callState: CallState;
  session: CallSession | null;
  isMuted: boolean;
  isSpeaker: boolean;
  duration: number;
  initiateCall: (request: import('../types/call').CallRequest) => Promise<void>;
  acceptIncomingCall: () => Promise<void>;
  declineIncomingCall: () => Promise<void>;
  cancelCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  setCallState: (state: CallState) => void;
  errorMessage: string | null;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

// Define allowed transitions for strict state machine
const ALLOWED_TRANSITIONS: Record<CallState, CallState[]> = {
  [CallState.IDLE]: [CallState.OUTGOING, CallState.INCOMING],
  [CallState.OUTGOING]: [CallState.RINGING, CallState.CONNECTING, CallState.ENDED, CallState.FAILED, CallState.REJECTED],
  [CallState.INCOMING]: [CallState.CONNECTING, CallState.ENDED, CallState.REJECTED],
  [CallState.RINGING]: [CallState.CONNECTING, CallState.ENDED, CallState.REJECTED],
  [CallState.CONNECTING]: [CallState.CONNECTED, CallState.FAILED, CallState.ENDED],
  [CallState.CONNECTED]: [CallState.RECONNECTING, CallState.ENDED, CallState.FAILED],
  [CallState.RECONNECTING]: [CallState.CONNECTED, CallState.FAILED, CallState.ENDED],
  [CallState.FAILED]: [CallState.IDLE],
  [CallState.REJECTED]: [CallState.IDLE],
  [CallState.ENDED]: [CallState.IDLE],
  [CallState.MISSED]: [CallState.IDLE],
  [CallState.NO_ANSWER]: [CallState.IDLE],
};

const printCallSummary = (session: CallSession | null, durationSeconds: number, reason: string) => {
  const sessionId = session?.sessionId || 'global';
  const audioSnapshot = callLogger.getAudioSnapshot(sessionId);
  const timeline = callLogger.getTimeline(sessionId);

  const summary = `
==================================================
                 CALL SUMMARY
==================================================
Session:          ${sessionId}
Channel:          ${session?.channelName || 'N/A'}
Local UID:        ${session?.uid || 0}
Remote UID:       ${session?.agoraUidUser === session?.uid ? session?.agoraUidSpa : session?.agoraUidUser}
Call Direction:   ${session?.direction || 'N/A'}
Duration:         ${durationSeconds} seconds
Reason Ended:     ${reason}

AUDIO STATES:
Mic Muted:        ${audioSnapshot.micMuted ? 'Yes' : 'No'}
Speaker Enabled:  ${audioSnapshot.speakerEnabled ? 'Yes' : 'No'}
Audio Route:      ${audioSnapshot.audioRoute}
Publish State:    ${audioSnapshot.publishState}
Subscribe State:  ${audioSnapshot.subscribeState}
Local State:      ${audioSnapshot.localAudioState}
Remote State:     ${audioSnapshot.remoteAudioState}

NETWORK QUALITY:
Tx Quality:       ${audioSnapshot.networkQualityTx}
Rx Quality:       ${audioSnapshot.networkQualityRx}

Remote Joined:    ${audioSnapshot.remoteJoined ? 'Yes' : 'No'}

ORDERED TIMELINE:
${timeline.map((event: string, idx: number) => `  ${idx + 1}. ${event}`).join('\n')}
==================================================
`;
  callLogger.info('SUMMARY', summary, { sessionId });
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callState, setCallStateInternal] = useState<CallState>(CallState.IDLE);
  const [session, setSession] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sessionRef = useRef(session);
  const callStateRef = useRef(callState);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(duration);
  const outgoingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endCallRef = useRef<(() => Promise<void>) | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    sessionRef.current = session;
    callStateRef.current = callState;
    durationRef.current = duration;
  }, [session, callState, duration]);

  // Deterministic state machine transition
  const setCallState = useCallback((nextState: CallState) => {
    const currentState = callStateRef.current;
    
    // Self-transitions are ignored safely
    if (currentState === nextState) return;

    const allowed = ALLOWED_TRANSITIONS[currentState] || [];
    if (allowed.includes(nextState)) {
      const startTime = Date.now();
      callLogger.setCallState(nextState);
      
      const ctx = {
        sessionId: sessionRef.current?.sessionId || 'NO_SESSION',
        callState: nextState,
        channelName: sessionRef.current?.channelName || 'N/A',
        uid: sessionRef.current?.uid || 0
      };

      callLogger.info('STATE', `Transition: ${currentState} -> ${nextState}`, ctx);
      callStateRef.current = nextState; // Synchronously update ref to prevent stale state in fast transitions
      setCallStateInternal(nextState);
      
      const duration = Date.now() - startTime;
      callLogger.info('STATE', `Transition completed. Duration: ${duration}ms`, ctx);
    } else {
      const ctx = {
        sessionId: sessionRef.current?.sessionId || 'NO_SESSION',
        callState: currentState,
        channelName: sessionRef.current?.channelName || 'N/A',
        uid: sessionRef.current?.uid || 0
      };
      callLogger.warn('STATE', `Invalid transition attempt: ${currentState} -> ${nextState}. Ignored.`, ctx);
      console.warn(`[CallContext] Invalid transition attempt: ${currentState} -> ${nextState}. Ignored.`);
    }
  }, []);

  // Initialize Agora Engine on startup
  useEffect(() => {
    const initAgora = async () => {
        try {
            await agoraService.initialize(AGORA_CONFIG.appId);

            console.log("[CallContext] Agora initialized");
        } catch (e) {
            console.error(e);
        }
    };

    initAgora();

    // AppState Listener to track background/foreground transitions
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const current = appStateRef.current;
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (current === 'active') {
          console.log('[APPSTATE]\nBackground');
          appStateRef.current = nextAppState;
        }
      } else if (nextAppState === 'active') {
        if (current === 'background' || current === 'inactive') {
          console.log('[APPSTATE]\nForeground');
          appStateRef.current = 'active';
        }
      }
    });

    return () => {
      subscription.remove();
      agoraService.release().catch(console.error);
    };
  }, []);

  // Duration Timer Management
  useEffect(() => {
    if (callState === CallState.CONNECTED) {
      if (!durationTimerRef.current) {
        durationTimerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
      if (callState === CallState.IDLE) {
        setDuration(0);
      }
    }
    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    };
  }, [callState]);

  const cleanupAndResetCall = useCallback(async (reason: string = 'unknown') => {
    console.log(`[CallContext] Cleaning up call state. Reason: ${reason}`);
    
    const sessionToSummarize = sessionRef.current;
    const durationToSummarize = durationRef.current;

    await callService.cleanup(reason);

    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (outgoingTimeoutRef.current) {
      clearTimeout(outgoingTimeoutRef.current);
      outgoingTimeoutRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    
    try {
      printCallSummary(sessionToSummarize, durationToSummarize, reason);
    } catch (e) {
      console.error('[CallContext] Failed to print call summary', e);
    }

    setSession(null);
    setIsMuted(false);
    setIsSpeaker(false);
    setDuration(0);
    setCallStateInternal(CallState.IDLE); // Force IDLE as reset
  }, []);

  // Handle Agora Callbacks
  useEffect(() => {
    const handleConnectionLostOrReconnecting = () => {
      if (callStateRef.current === CallState.CONNECTED || callStateRef.current === CallState.RECONNECTING) {
        if (callStateRef.current !== CallState.RECONNECTING) {
          console.log('[NETWORK]\nInternet Lost');
          console.log('[CALL]\nWaiting for Agora reconnect');
          setCallState(CallState.RECONNECTING);
        }
        if (!reconnectTimerRef.current) {
          reconnectTimerRef.current = setTimeout(() => {
            console.log('[CALL]\nReconnect timeout');
            reconnectTimerRef.current = null;
            setErrorMessage('Call ended due to network issue.');
            if (endCallRef.current) {
              endCallRef.current();
            }
          }, 30000);
        }
      }
    };

    const handleReconnected = () => {
      if (callStateRef.current === CallState.RECONNECTING) {
        console.log('[NETWORK]\nInternet Restored');
        console.log('[CALL]\nAgora reconnected');
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
        setCallState(CallState.CONNECTED);
      }
    };

    const handlers = {
      // onJoinChannelSuccess is handled directly via Promise in callService.joinPendingSession()
      onLeaveChannel: () => {
        setCallState(CallState.ENDED);
        setTimeout(() => cleanupAndResetCall('agora_leave_channel'), 2000);
      },
      onUserJoined: (connection: any, remoteUid: number) => {
        if (callStateRef.current === CallState.CONNECTING || callStateRef.current === CallState.RINGING) {
           setCallState(CallState.CONNECTED);
        }
      },
      onUserOffline: (connection: any, remoteUid: number, reason: number) => {
        setCallState(CallState.ENDED);
        cleanupAndResetCall('remote_user_offline');
      },
      onConnectionStateChanged: (connection: any, state: number, reason: number) => {
        if (state === 4) {
          handleConnectionLostOrReconnecting();
        } else if (state === 3) {
          handleReconnected();
        } else if (state === 5) {
          setCallState(CallState.FAILED);
          setErrorMessage('Connection failed. Please check your network.');
          setTimeout(() => cleanupAndResetCall('agora_connection_failed'), 2000);
        }
      },
      onConnectionLost: () => {
        handleConnectionLostOrReconnecting();
      },
      onRejoinChannelSuccess: () => {
        handleReconnected();
      },
      onAudioRoutingChanged: (routing: number) => {
        setIsSpeaker(routing === 4 || routing === 5);
      },
      onLocalAudioStateChanged: (connection: any, state: number, error: number) => {
        if (state === 0) setIsMuted(true);
        else setIsMuted(false);
      },
      onError: (err: number, msg: string) => {
        console.error(`[CallContext] Agora error code: ${err}, msg: ${msg}`);
        let friendlyMsg = 'An unexpected error occurred.';
        if (err === 109) friendlyMsg = 'Token expired. Please rejoin.';
        if (err === 110) friendlyMsg = 'Invalid token.';
        if (err === 17) friendlyMsg = 'Already joined channel.';
        
        // Log it, but don't force a failure state for 17 since we are already joined
        if (err !== 17) {
          setErrorMessage(friendlyMsg);
        }
      },
      onTokenPrivilegeWillExpire: () => {
        console.warn('[CallContext] Token will expire soon');
      },
    };

    agoraService.addListener(handlers);

    return () => {
      agoraService.removeListener(handlers);
    };
  }, [setCallState, cleanupAndResetCall]);

    // Handle Socket Events
  useEffect(() => {
    socketService.connect();

    callManager.setContextActions({
      setCallState,
      setSession,
      cleanupAndResetCall,
      getCallState: () => callStateRef.current
    });

    const handleRinging = (payload: any) => {
      if (payload?.direction === 'inbound') {
        callManager.handleIncomingCall(payload);
      } else {
        setCallState(CallState.RINGING);
      }
    };

    const handleAnswered = async (payload: any) => {
      if (outgoingTimeoutRef.current) {
        clearTimeout(outgoingTimeoutRef.current);
        outgoingTimeoutRef.current = null;
      }
      
      // Bug #4: Ignore duplicate call_accept socket event if connecting/active session already exists
      if (
        callStateRef.current === CallState.CONNECTING ||
        callStateRef.current === CallState.CONNECTED ||
        callService.getConnectingSession() ||
        callService.getActiveSession()
      ) {
        console.log('[Socket] Ignoring duplicate call_accept socket event: connecting or active session exists');
        return; // Ignore duplicate socket events
      }

      callService.handleCallAccepted(payload);

      const pending = callService.getPendingSession();
      if (!pending) return;

      callService.movePendingToConnecting();
      setCallState(CallState.CONNECTING);

      try {
        await callService.joinPendingSession();
        callService.promoteConnectingToActive();
        setCallState(CallState.CONNECTED);
        setSession(callService.getActiveSession());
        setErrorMessage(null);
      } catch (error) {
        console.error('[CallContext] Failed to join active call via Agora', error);
        setCallState(CallState.FAILED);
        cleanupAndResetCall('agora_join_failed');
      }
    };

    const handleDeclined = () => {
      if (outgoingTimeoutRef.current) {
        clearTimeout(outgoingTimeoutRef.current);
        outgoingTimeoutRef.current = null;
      }
      setCallState(CallState.REJECTED);
      setTimeout(() => cleanupAndResetCall('call_rejected'), 2000);
    };

    const handleCanceled = (payload: any) => {
      if (callStateRef.current === CallState.INCOMING) {
        callManager.handleRemoteEndOrCancel(payload?.callSessionId || sessionRef.current?.sessionId || '', 'call_canceled');
        return;
      }
      if (outgoingTimeoutRef.current) {
        clearTimeout(outgoingTimeoutRef.current);
        outgoingTimeoutRef.current = null;
      }
      setCallState(CallState.ENDED);
      setTimeout(() => cleanupAndResetCall('call_canceled'), 2000);
    };

    const handleEnded = (payload: any) => {
      if (callStateRef.current === CallState.INCOMING) {
        callManager.handleRemoteEndOrCancel(payload?.callSessionId || sessionRef.current?.sessionId || '', 'call_ended_remotely');
        return;
      }
      if (outgoingTimeoutRef.current) {
        clearTimeout(outgoingTimeoutRef.current);
        outgoingTimeoutRef.current = null;
      }
      setCallState(CallState.ENDED);
      cleanupAndResetCall('call_ended_remotely');
    };

    socketService.on('call_ringing', handleRinging);
    socketService.on('call_accept', handleAnswered);
    socketService.on('call_reject', handleDeclined);
    socketService.on('call_cancel', handleCanceled);
    socketService.on('call_end', handleEnded);

    return () => {
      socketService.off('call_ringing', handleRinging);
      socketService.off('call_accept', handleAnswered);
      socketService.off('call_reject', handleDeclined);
      socketService.off('call_cancel', handleCanceled);
      socketService.off('call_end', handleEnded);
      socketService.disconnect();
    };
  }, [setCallState, cleanupAndResetCall]);

  const initiateCall = useCallback(async (request: import('../types/call').CallRequest) => {
    if (callStateRef.current !== CallState.IDLE) {
      console.log(`[CallContext] initiateCall ignored. Current state is ${callStateRef.current}`);
      return;
    }
    try {
      setCallState(CallState.OUTGOING);
      const newSession = await callService.initiateCall(request);
      setSession(newSession);

      // Start 60-second timeout
      outgoingTimeoutRef.current = setTimeout(async () => {
        console.warn('[CallContext] Outgoing call timed out after 60 seconds');
        if (callStateRef.current === CallState.OUTGOING || callStateRef.current === CallState.RINGING) {
          setCallState(CallState.ENDED);
          await callService.cancelCall(sessionRef.current!);
          cleanupAndResetCall();
        }
      }, 60000);
    } catch (error) {
      console.error('[CallContext] Failed to initiate call', error);
      setCallState(CallState.FAILED);
      setTimeout(() => cleanupAndResetCall(), 2000);
    }
  }, [setCallState, cleanupAndResetCall]);

  const acceptIncomingCall = useCallback(async () => {
    if (!sessionRef.current || callStateRef.current !== CallState.INCOMING) return;
    try {
      setCallState(CallState.CONNECTING);
      await callService.answerCall(sessionRef.current);
    } catch (error) {
      console.error('[CallContext] Failed to accept call', error);
      setCallState(CallState.FAILED);
      setTimeout(() => cleanupAndResetCall(), 2000);
    }
  }, [setCallState, cleanupAndResetCall]);

  const declineIncomingCall = useCallback(async () => {
    if (!sessionRef.current || callStateRef.current !== CallState.INCOMING) return;
    try {
      await callService.declineCall(sessionRef.current);
      setCallState(CallState.REJECTED);
      setTimeout(() => cleanupAndResetCall(), 2000);
    } catch (error) {
      cleanupAndResetCall();
    }
  }, [setCallState, cleanupAndResetCall]);

  const cancelCall = useCallback(async () => {
    if (!sessionRef.current || (callStateRef.current !== CallState.OUTGOING && callStateRef.current !== CallState.RINGING)) return;
    try {
      setCallState(CallState.ENDED);
      await callService.cancelCall(sessionRef.current);
    } catch (error) {
      console.error('[CallContext] Error canceling call', error);
    } finally {
      setTimeout(() => cleanupAndResetCall(), 2000);
    }
  }, [setCallState, cleanupAndResetCall]);

  const endCall = useCallback(async () => {
    if (callStateRef.current === CallState.IDLE || callStateRef.current === CallState.ENDED) return;
    try {
      if (callStateRef.current === CallState.OUTGOING || callStateRef.current === CallState.RINGING) {
        // If the call hasn't been answered, it's a cancel action.
        await cancelCall();
        return;
      }
      setCallState(CallState.ENDED);
      await callService.endCall(sessionRef.current, durationRef.current || 0);
    } catch (error) {
      console.error('[CallContext] Error ending call', error);
    } finally {
      setTimeout(() => cleanupAndResetCall(), 2000);
    }
  }, [setCallState, cleanupAndResetCall, cancelCall]);

  endCallRef.current = endCall;

  const toggleMute = useCallback(() => {
    console.log(
    "[UI] Toggle mute",
    isMuted
);
    const nextMute = !isMuted;
    callService.toggleMute(nextMute).catch(console.error);
    setIsMuted(nextMute);
  }, [isMuted]);

  const toggleSpeaker = useCallback(() => {
    const nextSpeaker = !isSpeaker;
    callService.toggleSpeaker(nextSpeaker).catch(console.error);
    setIsSpeaker(nextSpeaker);
  }, [isSpeaker]);

  return (
    <CallContext.Provider
      value={{
        callState,
        session,
        isMuted,
        isSpeaker,
        duration,
        initiateCall,
        acceptIncomingCall,
        declineIncomingCall,
        cancelCall,
        endCall,
        toggleMute,
        toggleSpeaker,
        setCallState,
        errorMessage,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};
