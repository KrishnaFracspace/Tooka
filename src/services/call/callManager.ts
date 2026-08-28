import { CallSession, CallState } from '../../types/call';
import { callService } from './callService';
import { ringtoneService } from './ringtoneService';
import authAxiosClient from '../../api/authAxiosClient';
import { navigationRef } from '../../navigation/NavigationService';
import { StackActions } from '@react-navigation/native';

export interface CallContextActions {
  setCallState: (state: CallState) => void;
  setSession: (session: CallSession | null) => void;
  cleanupAndResetCall: (reason?: string) => void;
  getCallState: () => CallState;
}

const getLogContext = (): any => {
  try {
    const { callLogger } = require('./callLogger');
    const pending = callService.getPendingSession();
    const connecting = callService.getConnectingSession();
    const active = callService.getActiveSession();
    const session = active || connecting || pending;
    return {
      sessionId: session?.sessionId || 'NO_SESSION',
      callState: callLogger.getCallState(),
      channelName: session?.channelName || 'N/A',
      uid: session?.uid || 0
    };
  } catch (e) {
    return { sessionId: 'NO_SESSION', callState: 'UNKNOWN' };
  }
};

class CallManager {
  private contextActions: CallContextActions | null = null;
  private isAccepting = false;
  private isRejecting = false;

  setContextActions(actions: CallContextActions) {
    this.contextActions = actions;
  }

  async handleIncomingCall(payload: any): Promise<boolean> {
    const startTime = Date.now();
    const { callLogger } = require('./callLogger');
    const ctx = getLogContext();
    callLogger.info('CALL', 'ENTER: handleIncomingCall', ctx, { payload });

    if (!this.contextActions) {
      const duration = Date.now() - startTime;
      callLogger.warn('CALL', `handleIncomingCall failed: contextActions not set. Duration: ${duration}ms`, ctx);
      return false;
    }

    const currentState = this.contextActions.getCallState();
    if (currentState !== CallState.IDLE) {
      console.log(`[IncomingCall] Duplicate or conflicting call received while in state: ${currentState}. Ignoring/Rejecting.`);
      callLogger.warn('CALL', `Duplicate or conflicting call received while in state: ${currentState}. Auto-rejecting.`, ctx, { payload });
      
      // Auto-reject incoming call if we are already in another call
      try {
        const restStart = Date.now();
        await authAxiosClient.post(`/chat/calls/${payload.callSessionId}/reject`);
        callLogger.info('REST', `Auto-rejected conflicting call session: ${payload.callSessionId}. Duration: ${Date.now() - restStart}ms`, ctx);
      } catch (e) {
        console.error('[IncomingCall] Failed to auto-reject conflicting call', e);
        callLogger.error('REST', `Failed to auto-reject conflicting call session: ${payload.callSessionId}`, ctx, e);
      }
      const duration = Date.now() - startTime;
      callLogger.info('CALL', `EXIT: handleIncomingCall - REJECTED (busy). Duration: ${duration}ms`, ctx);
      return false;
    }

    const session: CallSession = {
      sessionId: payload.callSessionId,
      channelName: payload.channel,
      token: '',
      uid: 0,
      status: 'ringing',
      bookingId: '',
      spaId: '',
      conversationId: '',
      direction: payload.direction,
      callType: payload.callType,
      agoraUidUser: 0,
      agoraUidSpa: 0,
      caller: {
        id: '',
        name: payload.callerName || 'Unknown Caller',
        role: 'caller',
      },
      receiver: {
        id: '',
        name: 'Me',
        role: 'receiver',
      },
      createdAt: new Date().toISOString(),
    };

    console.log(`[IncomingCall] Received ringing, starting ringtone`);
    
    callService.createPendingSession(session);
    this.contextActions.setSession(session);
    
    const stateStart = Date.now();
    this.contextActions.setCallState(CallState.INCOMING);
    callLogger.info('STATE', `Transition state set to INCOMING. Duration: ${Date.now() - stateStart}ms`, ctx);
    
    const ringtoneStart = Date.now();
    ringtoneService.playIncoming().then(() => {
      callLogger.info('AUDIO', `Ringtone playback started successfully. Duration to trigger: ${Date.now() - ringtoneStart}ms`, ctx);
    }).catch(e => {
      callLogger.error('AUDIO', 'Ringtone playback failed', ctx, e);
    });

    console.log(`[Navigation] Showing IncomingCallScreen globally`);
    const navStart = Date.now();
    if (navigationRef.isReady()) {
      // @ts-ignore
      navigationRef.navigate('IncomingCall');
      callLogger.info('NAVIGATION', `Navigated to IncomingCallScreen. Duration: ${Date.now() - navStart}ms`, ctx);
    } else {
      callLogger.warn('NAVIGATION', `navigationRef not ready. Bypassed IncomingCallScreen navigation.`, ctx);
    }

    const duration = Date.now() - startTime;
    callLogger.info('CALL', `EXIT: handleIncomingCall - SUCCESS. Duration: ${duration}ms`, ctx);
    return true;
  }

  async acceptCall(): Promise<void> {
    const startTime = Date.now();
    const { callLogger } = require('./callLogger');
    const ctx = getLogContext();
    callLogger.info('CALL', 'ENTER: acceptCall', ctx);

    if (this.isAccepting || !this.contextActions) {
      console.log('[IncomingCall] Accept already in progress, ignoring duplicate tap.');
      const duration = Date.now() - startTime;
      callLogger.warn('CALL', `Accept already in progress, ignoring duplicate tap. Duration: ${duration}ms`, ctx);
      return;
    }
    this.isAccepting = true;

    console.log('[IncomingCall] Accept pressed');
    const ringtoneStopStart = Date.now();
    ringtoneService.stop();
    callLogger.info('AUDIO', `Ringtone stopped. Duration: ${Date.now() - ringtoneStopStart}ms`, ctx);

    const pending = callService.getPendingSession();
    if (!pending) {
      console.error('[IncomingCall] No pending session to accept');
      callLogger.error('CALL', 'No pending session found to accept', ctx);
      this.isAccepting = false;
      const duration = Date.now() - startTime;
      callLogger.info('CALL', `EXIT: acceptCall - FAILURE (no pending session). Duration: ${duration}ms`, ctx);
      return;
    }

    try {
      // Step 1: REST accept
      const restStart = Date.now();
      console.log(`[REST] POST /chat/calls/${pending.sessionId}/accept`);
      const response = await authAxiosClient.post(`/chat/calls/${pending.sessionId}/accept`);
      const data = response.data?.data || response.data;
      callLogger.info('REST', `Accept API Response. Status: ${response.status}, Duration: ${Date.now() - restStart}ms`, ctx, data);

      // Bug #8: Validate Agora token credentials object
      if (
        !data?.token?.token ||
        !data?.token?.channel ||
        data?.token?.uid === undefined
      ) {
        throw new Error('Backend failed to return valid Agora credentials.');
      }

      // Log token information in a sanitized format
      const tokenObj = data.token;
      callLogger.info('TOKEN', `Token details received - Channel: ${tokenObj.channel}, UID: ${tokenObj.uid}, Role: ${tokenObj.role || 'publisher'}`, ctx, {
        tokenTruncated: tokenObj.token ? `${tokenObj.token.substring(0, 15)}...[REDACTED]...${tokenObj.token.substring(tokenObj.token.length - 15)}` : 'N/A'
      });

      // Diff session objects before and after update
      const oldSessionCopy = { ...pending };

      // Bug #1 & #2: Update pending session from token object & callSession object
      pending.token = data.token.token;
      pending.channelName = data.token.channel;
      pending.uid = data.token.uid;

      if (data.callSession) {
        if (data.callSession.id) pending.sessionId = data.callSession.id;
        if (data.callSession.booking_id) pending.bookingId = data.callSession.booking_id;
        if (data.callSession.spa_id) pending.spaId = data.callSession.spa_id;
        if (data.callSession.conversation_id) pending.conversationId = data.callSession.conversation_id;
        if (data.callSession.status) pending.status = data.callSession.status;
        if (data.callSession.direction) pending.direction = data.callSession.direction;
        if (data.callSession.agora_uid_user !== undefined) pending.agoraUidUser = data.callSession.agora_uid_user;
        if (data.callSession.agora_uid_spa !== undefined) pending.agoraUidSpa = data.callSession.agora_uid_spa;
      }

      const diffStr = callLogger.diffObjects(oldSessionCopy, pending);
      callLogger.info('SESSION', `Pending Session updated in acceptCall (Diff):\n${diffStr}`, ctx);

      // Step 3: Move pending → connecting
      console.log('[CallFlow] Moving Pending → Connecting');
      callService.movePendingToConnecting();
      
      const stateStart1 = Date.now();
      this.contextActions.setCallState(CallState.CONNECTING);
      callLogger.info('STATE', `Transition state set to CONNECTING. Duration: ${Date.now() - stateStart1}ms`, ctx);

      // Step 4: Join Agora
      console.log('[Agora] Joining Agora channel:', pending.channelName);
      const agoraStart = Date.now();
      await callService.joinPendingSession();
      callLogger.info('AGORA', `Join channel completed. Duration: ${Date.now() - agoraStart}ms`, ctx);
      console.log('[Agora] Join success for channel:', pending.channelName);

      // Step 5: Promote connecting → active
      console.log('[CallFlow] Promoting Connecting → Active');
      callService.promoteConnectingToActive();

      // Step 6: Navigate CallScreen
      console.log('[IncomingCall] Navigating to CallScreen');
      const navStart = Date.now();
      if (navigationRef.isReady()) {
        const currentRoute = navigationRef.getCurrentRoute()?.name;
        if (currentRoute === 'IncomingCall') {
          navigationRef.dispatch(
            StackActions.replace('CallScreen', {
              bookingId: pending.bookingId,
              spaId: pending.spaId,
              callType: pending.callType,
              spaName: pending.caller.name,
              spaAvatar: pending.caller.avatarUrl || '',
              isIncoming: true,
            })
          );
          callLogger.info('NAVIGATION', `Replaced IncomingCallScreen with CallScreen. Duration: ${Date.now() - navStart}ms`, ctx);
        } else {
          // @ts-ignore
          navigationRef.navigate('CallScreen', {
            bookingId: pending.bookingId,
            spaId: pending.spaId,
            callType: pending.callType,
            spaName: pending.caller.name,
            spaAvatar: pending.caller.avatarUrl || '',
            isIncoming: true,
          });
          callLogger.info('NAVIGATION', `Navigated to CallScreen. Duration: ${Date.now() - navStart}ms`, ctx);
        }
      } else {
        callLogger.warn('NAVIGATION', `navigationRef not ready. Bypassed CallScreen navigation.`, ctx);
      }

      // Step 7: CONNECTED
      console.log('[IncomingCall] Connected');
      const stateStart2 = Date.now();
      this.contextActions.setCallState(CallState.CONNECTED);
      callLogger.info('STATE', `Transition state set to CONNECTED. Duration: ${Date.now() - stateStart2}ms`, ctx);
      
      this.contextActions.setSession(callService.getActiveSession());

      const totalDuration = Date.now() - startTime;
      callLogger.info('CALL', `EXIT: acceptCall - SUCCESS. Duration: ${totalDuration}ms`, ctx);
    } catch (error) {
      console.error('[IncomingCall] Failed to accept call:', error);
      // Bug #3: Only cleanup after a real failure
      this.contextActions.setCallState(CallState.FAILED);
      this.contextActions.cleanupAndResetCall('agora_join_failed');
      
      const duration = Date.now() - startTime;
      callLogger.error('CALL', `EXIT: acceptCall - FAILURE. Duration: ${duration}ms`, ctx, error);
      
      // Persist logs as failure virtual file
      callLogger.persistSessionLogs(pending.sessionId, true);
    } finally {
      this.isAccepting = false;
    }
  }

  async rejectCall(): Promise<void> {
    const startTime = Date.now();
    const { callLogger } = require('./callLogger');
    const ctx = getLogContext();
    callLogger.info('CALL', 'ENTER: rejectCall', ctx);

    if (this.isRejecting || !this.contextActions) {
      const duration = Date.now() - startTime;
      callLogger.warn('CALL', `Reject already in progress, ignoring. Duration: ${duration}ms`, ctx);
      return;
    }
    this.isRejecting = true;
    
    console.log('[IncomingCall] Reject pressed');
    const stopRingStart = Date.now();
    ringtoneService.stop();
    callLogger.info('AUDIO', `Ringtone stopped. Duration: ${Date.now() - stopRingStart}ms`, ctx);

    const pending = callService.getPendingSession();
    if (!pending) {
      this.isRejecting = false;
      const duration = Date.now() - startTime;
      callLogger.warn('CALL', `No pending session found to reject. Duration: ${duration}ms`, ctx);
      return;
    }

    try {
      const restStart = Date.now();
      console.log(`[REST] POST /chat/calls/${pending.sessionId}/reject`);
      await authAxiosClient.post(`/chat/calls/${pending.sessionId}/reject`);
      callLogger.info('REST', `rejectCall API response. Duration: ${Date.now() - restStart}ms`, ctx);
    } catch (error) {
      console.error('[IncomingCall] Error rejecting call', error);
      callLogger.error('REST', 'Error rejecting call via REST', ctx, error);
    } finally {
      const navStart = Date.now();
      if (navigationRef.isReady() && navigationRef.getCurrentRoute()?.name === 'IncomingCall') {
        navigationRef.goBack();
        callLogger.info('NAVIGATION', `Navigated back from IncomingCallScreen. Duration: ${Date.now() - navStart}ms`, ctx);
      }
      
      const stateStart = Date.now();
      this.contextActions.setCallState(CallState.REJECTED);
      callLogger.info('STATE', `Transition state set to REJECTED. Duration: ${Date.now() - stateStart}ms`, ctx);
      
      setTimeout(() => {
        const cleanupStart = Date.now();
        this.contextActions?.cleanupAndResetCall('rejected_by_user');
        callLogger.info('CALL', `cleanupAndResetCall triggered. Duration to execute: ${Date.now() - cleanupStart}ms`, ctx);
        // Persist session logs
        callLogger.persistSessionLogs(pending.sessionId, false);
      }, 1000);
      this.isRejecting = false;
      const totalDuration = Date.now() - startTime;
      callLogger.info('CALL', `EXIT: rejectCall - SUCCESS. Duration: ${totalDuration}ms`, ctx);
    }
  }

  handleRemoteEndOrCancel(sessionId: string, reason: string): void {
    const startTime = Date.now();
    const { callLogger } = require('./callLogger');
    const ctx = getLogContext();
    callLogger.info('CALL', `ENTER: handleRemoteEndOrCancel - sessionId=${sessionId}, reason=${reason}`, ctx);

    const pending = callService.getPendingSession();
    const active = callService.getActiveSession();
    const connecting = callService.getConnectingSession();

    const currentId = pending?.sessionId || active?.sessionId || connecting?.sessionId;
    
    if (currentId !== sessionId) {
      console.log(`[IncomingCall] Remote cancelled event for different session ${sessionId}. Ignoring.`);
      const duration = Date.now() - startTime;
      callLogger.info('CALL', `Remote end/cancel event ignored - mismatched session ID ${sessionId}. Duration: ${duration}ms`, ctx);
      return;
    }

    console.log(`[IncomingCall] Remote cancelled/ended call. Reason: ${reason}`);
    
    const ringStopStart = Date.now();
    ringtoneService.stop();
    callLogger.info('AUDIO', `Ringtone stopped. Duration: ${Date.now() - ringStopStart}ms`, ctx);

    const navStart = Date.now();
    if (navigationRef.isReady() && navigationRef.getCurrentRoute()?.name === 'IncomingCall') {
      navigationRef.goBack();
      callLogger.info('NAVIGATION', `Navigated back from IncomingCallScreen. Duration: ${Date.now() - navStart}ms`, ctx);
    }
    
    if (this.contextActions) {
      const stateStart = Date.now();
      this.contextActions.setCallState(CallState.ENDED);
      callLogger.info('STATE', `Transition state set to ENDED. Duration: ${Date.now() - stateStart}ms`, ctx);
      
      const cleanupStart = Date.now();
      this.contextActions.cleanupAndResetCall(reason);
      callLogger.info('CALL', `cleanupAndResetCall triggered. Duration to execute: ${Date.now() - cleanupStart}ms`, ctx);
    }

    // Persist logs
    callLogger.persistSessionLogs(sessionId, reason === 'call_canceled' || reason === 'agora_join_failed');

    const totalDuration = Date.now() - startTime;
    callLogger.info('CALL', `EXIT: handleRemoteEndOrCancel. Duration: ${totalDuration}ms`, ctx);
  }
}

export const callManager = new CallManager();
