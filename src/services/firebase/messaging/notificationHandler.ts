import messaging from '@react-native-firebase/messaging';

class NotificationHandler {
  initialize() {
    messaging().onMessage(async remoteMessage => {
      console.log(
        '[FCM] Foreground Notification',
        JSON.stringify(remoteMessage, null, 2),
      );
    });
  }
}

export default new NotificationHandler();