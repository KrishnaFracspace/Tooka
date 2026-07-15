import { Platform, PermissionsAndroid } from 'react-native';
import messaging, {
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

class NotificationPermission {
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      return true;
    }

    const status = await messaging().requestPermission();

    return (
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL
    );
  }
}

export default new NotificationPermission();