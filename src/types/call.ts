export enum CallState {
  IDLE = 'IDLE',
  OUTGOING = 'OUTGOING',
  RINGING = 'RINGING',
  INCOMING = 'INCOMING',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  MISSED = 'MISSED',
  NO_ANSWER = 'NO_ANSWER',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED',
  ENDED = 'ENDED',
}

export interface CallParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'caller' | 'receiver';
}

export interface CallRequest {
  bookingId: string;
  spaId: string;
  callType: 'voice' | 'video';
}

export interface CallSession {
    sessionId: string;
    channelName: string;
    token: string;
    uid: number;
    status: string;
    bookingId: string;
    spaId: string;
    conversationId: string;
    direction: 'outbound' | 'inbound';
    callType: 'voice' | 'video';
    agoraUidUser: number;
    agoraUidSpa: number;
    caller: CallParticipant;
    receiver: CallParticipant;
    createdAt: string;
}

export interface CallApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface CallEvents {
  onStateChange?: (state: CallState) => void;
  onParticipantJoined?: (uid: number) => void;
  onParticipantLeft?: (uid: number) => void;
  onError?: (error: Error) => void;
}
