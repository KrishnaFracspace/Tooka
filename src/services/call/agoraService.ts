import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngineEventHandler,
  AudioProfileType,
  AudioScenarioType,
} from 'react-native-agora';
import { Platform } from 'react-native';

class AgoraService {
  private engine?: IRtcEngine;
  private isInitialized = false;
  
  // Idempotency state guards
  private isJoining = false;
  private isJoined = false;
  private currentChannel: string | null = null;
  private currentUid: number | null = null;

  private eventHandlers: Set<Partial<IRtcEngineEventHandler>> = new Set();

  async initialize(appId: string): Promise<void> {
    if (this.isInitialized && this.engine) {
      console.log('[AgoraService] initialize ignored. Engine already initialized.');
      return;
    }

    console.log(`[AgoraService] Initializing engine with appId: ${appId}`);
    try {
      this.engine = createAgoraRtcEngine();
      this.engine.initialize({ appId });
      
      this.engine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      this.engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      this.engine.enableAudio();

      // Configure Audio Session for background, bluetooth, speaker
      if (Platform.OS === 'ios') {
        this.engine.setAudioProfile(AudioProfileType.AudioProfileDefault, AudioScenarioType.AudioScenarioDefault);
      } else {
        this.engine.setAudioProfile(AudioProfileType.AudioProfileDefault, AudioScenarioType.AudioScenarioChatroom);
      }

      this.engine.setDefaultAudioRouteToSpeakerphone(false); // Default to earpiece for calls

      this.registerInternalCallbacks();
      this.isInitialized = true;
      console.log('[AgoraService] Engine initialization successful.');
    } catch (error) {
      console.error('[AgoraService] Failed to initialize engine:', error);
      throw error;
    }
  }

  private registerInternalCallbacks() {
    if (!this.engine) return;

    this.engine.registerEventHandler({
      onJoinChannelSuccess: (connection, elapsed) => {
        console.log(`[AgoraService] onJoinChannelSuccess: channel=${connection.channelId}, uid=${connection.localUid}, elapsed=${elapsed}ms`);
        this.isJoining = false;
        this.isJoined = true;
        this.emit('onJoinChannelSuccess', connection, elapsed);
      },
      onLeaveChannel: (connection, stats) => {
        console.log(`[AgoraService] onLeaveChannel: duration=${stats.duration}s`);
        this.resetInternalState();
        this.emit('onLeaveChannel', connection, stats);
      },
      onUserJoined: (connection, remoteUid, elapsed) => {
        console.log(`[AgoraService] onUserJoined: remoteUid=${remoteUid}`);
        this.emit('onUserJoined', connection, remoteUid, elapsed);
      },
      onUserOffline: (connection, remoteUid, reason) => {
        console.log(`[AgoraService] onUserOffline: remoteUid=${remoteUid}, reason=${reason}`);
        this.emit('onUserOffline', connection, remoteUid, reason);
      },
      onConnectionStateChanged: (connection, state, reason) => {
        console.log(`[AgoraService] onConnectionStateChanged: state=${state}, reason=${reason}`);
        this.emit('onConnectionStateChanged', connection, state, reason);
      },
      onConnectionLost: (connection) => {
        console.log(`[AgoraService] onConnectionLost`);
        this.emit('onConnectionLost', connection);
      },
      onRejoinChannelSuccess: (connection, elapsed) => {
        console.log(`[AgoraService] onRejoinChannelSuccess`);
        this.emit('onRejoinChannelSuccess', connection, elapsed);
      },
      onTokenPrivilegeWillExpire: (connection, token) => {
        console.log(`[AgoraService] onTokenPrivilegeWillExpire`);
        // TODO: Handle RTC Token Renewal (fetch from backend)
        this.emit('onTokenPrivilegeWillExpire', connection, token);
      },
      onRequestToken: (connection) => {
        console.log(`[AgoraService] onRequestToken`);
        // TODO: Handle RTC Token Renewal
        this.emit('onRequestToken', connection);
      },
      onAudioRoutingChanged: (routing) => {
        console.log(`[AgoraService] onAudioRoutingChanged: route=${routing}`);
        this.emit('onAudioRoutingChanged', routing);
      },
      onNetworkQuality: (connection, remoteUid, txQuality, rxQuality) => {
        // Reduced log spam: only log poor quality or emit to context
        this.emit('onNetworkQuality', connection, remoteUid, txQuality, rxQuality);
      },
      onError: (err, msg) => {
        console.error(`[AgoraService] onError: code=${err}, msg=${msg}`);
        if (this.isJoining) {
          this.isJoining = false;
        }
        this.emit('onError', err, msg);
      },
      onAudioVolumeIndication: (connection, speakers, speakerNumber, totalVolume) => {
        this.emit('onAudioVolumeIndication', connection, speakers, speakerNumber, totalVolume);
      },
      onActiveSpeaker: (connection, uid) => {
        console.log(`[AgoraService] onActiveSpeaker: uid=${uid}`);
        this.emit('onActiveSpeaker', connection, uid);
      },
      onRemoteAudioStateChanged: (connection, remoteUid, state, reason, elapsed) => {
        console.log(`[AgoraService] onRemoteAudioStateChanged: remoteUid=${remoteUid}, state=${state}, reason=${reason}`);
        this.emit('onRemoteAudioStateChanged', connection, remoteUid, state, reason, elapsed);
      },
      onLocalAudioStateChanged: (connection, state, error) => {
        console.log(`[AgoraService] onLocalAudioStateChanged: state=${state}, error=${error}`);
        this.emit('onLocalAudioStateChanged', connection, state, error);
      },
    });
  }

  addListener(handler: Partial<IRtcEngineEventHandler>) {
    this.eventHandlers.add(handler);
  }

  removeListener(handler: Partial<IRtcEngineEventHandler>) {
    this.eventHandlers.delete(handler);
  }

  private emit<K extends keyof IRtcEngineEventHandler>(event: K, ...args: Parameters<NonNullable<IRtcEngineEventHandler[K]>>) {
    this.eventHandlers.forEach((handler) => {
      const cb = handler[event];
      if (typeof cb === 'function') {
        // @ts-ignore
        cb(...args);
      }
    });
  }

  private resetInternalState() {
    this.isJoining = false;
    this.isJoined = false;
    this.currentChannel = null;
    this.currentUid = null;
  }

  async joinChannel(token: string, channelName: string, uid: number): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('Agora Engine not initialized');
    }

    if (this.isJoining) {
      console.log('[AgoraService] joinChannel ignored. Already currently joining a channel.');
      return;
    }

    if (this.isJoined) {
      if (this.currentChannel === channelName) {
        console.log(`[AgoraService] joinChannel ignored. Already joined channel: ${channelName}`);
        return;
      }
      console.log(`[AgoraService] Leaving previous channel ${this.currentChannel} before joining new channel.`);
      await this.leaveChannel();
    }

    console.log(`[AgoraService] Joining channel: ${channelName} with uid: ${uid}`);
    
    this.isJoining = true;
    this.currentChannel = channelName;
    this.currentUid = uid;

    // Join with options
    this.engine.joinChannel(token, channelName, uid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      autoSubscribeAudio: true,
    });
  }

  async leaveChannel(): Promise<void> {
    if (!this.isInitialized || !this.engine) return;
    
    if (!this.isJoined && !this.isJoining) {
      console.log('[AgoraService] leaveChannel ignored. Not currently joined or joining.');
      return;
    }

    console.log(`[AgoraService] Leaving channel: ${this.currentChannel || 'unknown'}`);
    this.engine.leaveChannel();
    this.resetInternalState();
  }

  async muteLocalAudioStream(muted: boolean): Promise<void> {
    if (!this.isInitialized || !this.engine) return;
    console.log(`[AgoraService] Muting local audio stream: ${muted}`);
    this.engine.muteLocalAudioStream(muted);
  }

  async setEnableSpeakerphone(enabled: boolean): Promise<void> {
    if (!this.isInitialized || !this.engine) return;
    console.log(`[AgoraService] Setting speakerphone: ${enabled}`);
    this.engine.setEnableSpeakerphone(enabled);
  }

  async release(): Promise<void> {
    if (this.engine) {
      console.log('[AgoraService] Releasing engine resources');
      await this.leaveChannel();
      this.engine.release();
      this.engine = undefined;
      this.isInitialized = false;
      this.eventHandlers.clear();
      this.resetInternalState();
    }
  }
}

export const agoraService = new AgoraService();
