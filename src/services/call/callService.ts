import { agoraService } from './agoraService';
import { socketService } from './socketService';
import { CallSession, CallRequest } from '../../types/call';
import authAxiosClient from '../../api/authAxiosClient';

// TODO: Replace with real API calls

class CallService {
  private activeSession: CallSession | null = null;
  private isInitiating = false;
  private isAnswering = false;
  private isDeclining = false;
  private isCanceling = false;
  private isEnding = false;

  async initiateCall(request: CallRequest): Promise<CallSession> {
    if (this.activeSession || this.isInitiating) {
      console.log(`[CallService] initiateCall ignored. Session exists or is initiating.`);
      return Promise.resolve(this.activeSession!);
    }
    this.isInitiating = true;

    console.log(`[CallService] Initiating call to spa: ${request.spaId} for booking: ${request.bookingId}`);
    
    try {
      const response = await authAxiosClient.post('/chat/calls/request', {
        booking_id: request.bookingId,
        spa_id: request.spaId,
        call_type: request.callType,
      });

      const data = response.data?.data || response.data;

      const session: CallSession = {
        // Backend returns id inside callSession
        sessionId: data.callSession.id,

        // Agora credentials
        channelName: data.channelName,
        token: data.token,
        uid: data.uid,

        // Call information
        status: data.callSession.status,

        // Caller (backend doesn't return profile yet)
        caller: {
          id: data.callSession.user_id,
          name: 'Me', // TODO: Replace with logged-in user name
          role: 'caller',
        },

        // Receiver (backend doesn't return spa profile yet)
        receiver: {
          id: data.callSession.spa_id,
          name: 'Spa', // TODO: Replace with spa name when available
          avatarUrl: '',
          role: 'receiver',
        },

        // Session timestamps
        createdAt:
          data.callSession.created_at ??
          data.callSession.initiated_at ??
          new Date().toISOString(),

        // Additional backend fields (add these to CallSession interface)
        bookingId: data.callSession.booking_id,
        spaId: data.callSession.spa_id,
        conversationId: data.callSession.conversation_id,

        callType: data.callSession.call_type,
        direction: data.callSession.direction,

        agoraUidUser: data.callSession.agora_uid_user,
        agoraUidSpa: data.callSession.agora_uid_spa,
      };

      this.activeSession = session;
      this.activeSession = session;
      
      socketService.emit('call_request', {
        bookingId: session.bookingId,
        callType: session.callType
      });
      console.log("Event emitted call_request with backend....");

      return session;
    } catch (error) {
      console.error('[CallService] API error during initiateCall:', error);
      throw error;
    } finally {
      this.isInitiating = false;
    }
  }

  async answerCall(session: CallSession): Promise<void> {
    if (this.isAnswering) return;
    this.isAnswering = true;
    try {
      console.log(`[CallService] Answering call: ${session.sessionId}`);
      
      const response = await authAxiosClient.post(`/chat/calls/${session.sessionId}/accept`, {
        spa_id: session.spaId,
      });
      
      const data = response.data?.data || response.data;
      if (!data.token || !data.channelName || data.uid === undefined) {
        throw new Error('Backend failed to return valid Agora credentials on accept.');
      }

      session.token = data.token;
      session.channelName = data.channelName;
      session.uid = data.uid;
      this.activeSession = session;

      socketService.emit('call_accept', session.sessionId);
      await agoraService.joinChannel(session.token, session.channelName, session.uid);
    } catch (error) {
      console.error('[CallService] API error answering call:', error);
      throw error;
    } finally {
      this.isAnswering = false;
    }
  }
  
  async joinActiveCall(session: CallSession): Promise<void> {
    if (this.activeSession?.sessionId === session.sessionId) {
      console.log(`[CallService] joinActiveCall ignored. Already active for: ${session.sessionId}`);
      return;
    }
    if (!session.token || !session.channelName || session.uid === undefined) {
      console.error('[CallService] Cannot join active call without valid Agora credentials.');
      return;
    }
    console.log(`[CallService] Joining active call: ${session.sessionId}`);
    this.activeSession = session;
    await agoraService.joinChannel(session.token, session.channelName, session.uid);
  }

  async declineCall(session: CallSession): Promise<void> {
    if (this.isDeclining) return;
    this.isDeclining = true;
    try {
      console.log(`[CallService] Declining call: ${session.sessionId}`);
      await authAxiosClient.post(`/chat/calls/${session.sessionId}/reject`, {
        spa_id: session.spaId,
      });
      socketService.emit('call_reject', session.sessionId);
    } catch (error) {
      console.error('[CallService] Error declining call:', error);
    } finally {
      this.activeSession = null;
      this.isDeclining = false;
    }
  }

  async cancelCall(session: CallSession): Promise<void> {
    if (this.isCanceling) return;
    this.isCanceling = true;
    try {
      console.log(`[CallService] Canceling call: ${session.sessionId}`);
      await authAxiosClient.post(`/chat/calls/${session.sessionId}/cancel`, {
        spa_id: session.spaId,
      });
      // Do not emit call_end per instructions
    } catch (error) {
      console.error('[CallService] Error canceling call:', error);
    } finally {
      await agoraService.leaveChannel();
      this.activeSession = null;
      this.isCanceling = false;
    }
  }

  async endCall(session: CallSession | null, durationSeconds: number, isRemote: boolean = false): Promise<void> {
    if (this.isEnding || !session) return;
    this.isEnding = true;
    try {
      if (!isRemote) {
        console.log(`[CallService] Ending call: ${session.sessionId}`);
        await authAxiosClient.post(`/chat/calls/${session.sessionId}/end`, {
          spa_id: session.spaId,
          duration_seconds: durationSeconds,
        });
        socketService.emit('call_end', session.sessionId);
      } else {
        console.log(`[CallService] Call ended remotely: ${session.sessionId}`);
      }
    } catch (error) {
      console.error('[CallService] Error ending call:', error);
    } finally {
      await agoraService.leaveChannel();
      this.activeSession = null;
      this.isEnding = false;
      console.log(`[CallService] Call ended and cleanup complete.`);
    }
  }

  async toggleMute(isMuted: boolean): Promise<void> {
    await agoraService.muteLocalAudioStream(isMuted);
  }

  async toggleSpeaker(isSpeaker: boolean): Promise<void> {
    await agoraService.setEnableSpeakerphone(isSpeaker);
  }
}

export const callService = new CallService();
