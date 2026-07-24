import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { restart, sync, useStallionUpdate, withStallion } from 'react-native-stallion';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { NearbySpaProvider } from './src/context/NearbySpaContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { PaymentProvider } from './src/context/PaymentContext';

function App() {
  const { isRestartRequired, currentlyRunningBundle } = useStallionUpdate();

  // Check for OTA updates when the app starts
  useEffect(() => {
    sync();
  }, []);

  // Restart automatically once a new bundle has been downloaded
  // useEffect(() => {
  //   console.log('=== Stallion Debug ===');
  //   console.log('isRestartRequired:', isRestartRequired);
  //   // console.log('newReleaseBundle:', newReleaseBundle);
  //   console.log('currentlyRunningBundle:', currentlyRunningBundle); 

  //   if (isRestartRequired) {
  //     restart();
  //   }
  // }, [isRestartRequired]);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <AuthProvider>
          <LocationProvider>
            <ProfileProvider>
              <NearbySpaProvider>
                <PaymentProvider>
                  <AppNavigator />
                </PaymentProvider>
              </NearbySpaProvider>
            </ProfileProvider>
          </LocationProvider>
        </AuthProvider>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
});

export default withStallion(App);