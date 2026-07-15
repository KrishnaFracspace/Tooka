import messaging from '@react-native-firebase/messaging';

class FirebaseMessagingService {
  async getToken() {
    return await messaging().getToken();
  }

  async deleteToken() {
    await messaging().deleteToken();
  }

  onTokenRefresh(listener: (token: string) => void) {
    return messaging().onTokenRefresh(listener);
  }
}

export default new FirebaseMessagingService();