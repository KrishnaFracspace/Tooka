import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { CallState, CallSession } from '../types/call';
import { socketService } from '../services/call/socketService';
import { callService } from '../services/call/callService';
import { agoraService } from '../services/call/agoraService';
import { AGORA_CONFIG } from '../config/agora';

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
      console.log(`[CallContext] Transition: ${currentState} -> ${nextState}`);
      setCallStateInternal(nextState);
    } else {
      console.warn(`[CallContext] Invalid transition attempt: ${currentState} -> ${nextState}. Ignored.`);
    }
  }, []);

  // Initialize Agora Engine once on mount
  useEffect(() => {
    agoraService.initialize(AGORA_CONFIG.appId).catch(console.error);

    // AppState Listener to maintain call sync
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      console.log(`[CallContext] AppState changed to: ${nextAppState}`);
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

  const cleanupAndResetCall = useCallback(() => {
    console.log('[CallContext] Cleaning up call state.');
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    setSession(null);
    setIsMuted(false);
    setIsSpeaker(false);
    setDuration(0);
    setErrorMessage(null);
    setCallStateInternal(CallState.IDLE); // Force IDLE as reset
  }, []);

  // Handle Agora Callbacks
  useEffect(() => {
    const handlers = {
      onJoinChannelSuccess: () => {
        setCallState(CallState.CONNECTED);
        setErrorMessage(null);
      },
      onLeaveChannel: () => {
        setCallState(CallState.ENDED);
        setTimeout(() => cleanupAndResetCall(), 2000);
      },
      onUserJoined: (connection: any, remoteUid: number) => {
        if (callStateRef.current === CallState.CONNECTING || callStateRef.current === CallState.RINGING) {
           setCallState(CallState.CONNECTED);
        }
      },
      onUserOffline: (connection: any, remoteUid: number, reason: number) => {
        setCallState(CallState.ENDED);
        callService.endCall(sessionRef.current, durationRef.current || 0, true).catch(console.error);
      },
      onConnectionStateChanged: (connection: any, state: number, reason: number) => {
        if (state === 4) setCallState(CallState.RECONNECTING);
        if (state === 5) {
          setCallState(CallState.FAILED);
          setErrorMessage('Connection failed. Please check your network.');
          setTimeout(() => cleanupAndResetCall(), 2000);
        }
      },
      onConnectionLost: () => {
        setCallState(CallState.RECONNECTING);
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

    const handleRinging = () => {
      setCallState(CallState.RINGING);
    };

    const handleAnswered = async () => {
      setCallState(CallState.CONNECTING);
      if (sessionRef.current) {
        try {
          await callService.joinActiveCall(sessionRef.current);
        } catch (error) {
          console.error('[CallContext] Failed to join active call via Agora', error);
          setCallState(CallState.FAILED);
          setTimeout(() => cleanupAndResetCall(), 2000);
        }
      }
    };

    const handleDeclined = () => {
      setCallState(CallState.REJECTED);
      setTimeout(() => cleanupAndResetCall(), 2000);
    };

    const handleCanceled = () => {
      setCallState(CallState.ENDED);
      setTimeout(() => cleanupAndResetCall(), 2000);
    };

    const handleEnded = () => {
      setCallState(CallState.ENDED);
      callService.endCall(sessionRef.current, durationRef.current || 0, true).catch(console.error);
      setTimeout(() => cleanupAndResetCall(), 2000);
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
      await callService.endCall(sessionRef.current, durationRef.current || 0, false);
    } catch (error) {
      console.error('[CallContext] Error ending call', error);
    } finally {
      setTimeout(() => cleanupAndResetCall(), 2000);
    }
  }, [setCallState, cleanupAndResetCall, cancelCall]);

  const toggleMute = useCallback(() => {
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
