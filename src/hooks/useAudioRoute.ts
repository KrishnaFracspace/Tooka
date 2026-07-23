import { useState, useCallback } from 'react';
import { agoraService } from '../services/call/agoraService';

export const useAudioRoute = (initialState: boolean = false) => {
  const [isSpeaker, setIsSpeaker] = useState(initialState);

  const toggleSpeaker = useCallback(async () => {
    try {
      const nextState = !isSpeaker;
      await agoraService.setEnableSpeakerphone(nextState);
      setIsSpeaker(nextState);
    } catch (error) {
      console.error('Failed to toggle speaker', error);
    }
  }, [isSpeaker]);

  return { isSpeaker, toggleSpeaker };
};
