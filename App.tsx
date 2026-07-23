import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { NearbySpaProvider } from './src/context/NearbySpaContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { PaymentProvider } from './src/context/PaymentContext';
import { CallProvider } from './src/context/CallContext';

function App() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <AuthProvider>
          <LocationProvider>
            <ProfileProvider>
              <NearbySpaProvider>
                <PaymentProvider>
                  <CallProvider>
                    <AppNavigator />
                  </CallProvider>
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

export default App;
