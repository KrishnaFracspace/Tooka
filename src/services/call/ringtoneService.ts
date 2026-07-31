// @ts-ignore
import Sound from 'react-native-sound';

// Enable playback in silence mode
// @ts-ignore
Sound.setCategory('Playback');

class RingtoneService {
  private ringtone: any | null = null;
  private isPlaying = false;

  async play(): Promise<void> {
    if (this.isPlaying || this.ringtone) {
      console.log('[RingtoneService] Ringtone already playing or loaded.');
      return;
    }

    return new Promise((resolve, reject) => {
      // Use a bundled sound file or default system ringtone if possible.
      // @ts-ignore
      this.ringtone = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
          console.error('[RingtoneService] Failed to load the ringtone', error);
          this.ringtone = null;
          reject(error);
          return;
        }

        if (this.ringtone) {
          this.ringtone.setNumberOfLoops(-1); // Infinite loop
          this.ringtone.play((success: boolean) => {
            if (!success) {
              console.error('[RingtoneService] Playback failed due to audio decoding errors');
              this.ringtone?.reset();
            }
          });
          this.isPlaying = true;
          console.log('[IncomingCall] Starting ringtone');
          resolve();
        }
      });
    });
  }

  stop(): void {
    if (this.ringtone && this.isPlaying) {
      console.log('[IncomingCall] Stopping ringtone');
      this.ringtone.stop(() => {
        this.isPlaying = false;
        this.ringtone?.release();
        this.ringtone = null;
      });
    }
  }

  release(): void {
    this.stop();
  }
}

export const ringtoneService = new RingtoneService();
