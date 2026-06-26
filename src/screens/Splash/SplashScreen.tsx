import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import BootSplash from 'react-native-bootsplash';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Splash: undefined;
  BottomNavigation: undefined;
};

type SplashScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    'Splash'
  >;

const SplashScreen: React.FC = () => {
  const navigation =
    useNavigation<SplashScreenNavigationProp>();

  const hasNavigated = useRef(false);

  useEffect(() => {
    BootSplash.hide({
      fade: true,
    });
  }, []);

  const navigateToApp = () => {
    if (hasNavigated.current) {
      return;
    }

    hasNavigated.current = true;

    navigation.replace('BottomNavigation');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Video
        source={require('../../assets/videos/splash.mp4')}
        style={styles.video}
        resizeMode="cover"
        repeat={false}
        muted={false}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        onEnd={navigateToApp}
        onError={(error) => {
          console.log(
            'Splash Video Error =>',
            error,
          );

          navigateToApp();
        }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});