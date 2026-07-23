import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const useMicrophonePermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        setHasPermission(granted);
      } else {
        // iOS permissions typically requested on first use natively by Agora, but you can add react-native-permissions here
        setHasPermission(true);
      }
    };
    
    checkPermission();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Tooka needs access to your microphone to make calls.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        const result = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasPermission(result);
        return result;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS fallback
  };

  return { hasPermission, requestPermission };
};
