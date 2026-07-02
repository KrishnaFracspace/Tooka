import React, { useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SpaDetailsContent from './SpaDetailsContent';
import { useSpaDetails } from '../../hooks/useSpaDetails';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

type SpaDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SpaDetails'>;
type SpaDetailsRouteProp = RouteProp<RootStackParamList, 'SpaDetails'>;

function SpaDetailsScreen(): React.ReactElement {
  const navigation = useNavigation<SpaDetailsNavigationProp>();
  const route = useRoute<SpaDetailsRouteProp>();
  const { spaId, serviceId, serviceName, openEnquiry } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { spa, loading, refreshing, error, refetch, onRefresh } = useSpaDetails(spaId);

  useEffect(() => {
    if (openEnquiry) {
      navigation.setParams({ openEnquiry: false });
    }
  }, [navigation, openEnquiry]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, isTablet && styles.containerTablet]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFAA26" />}
      >
        <SpaDetailsContent
          spa={spa}
          loading={loading}
          error={error}
          onRetry={refetch}
          spaId={spaId}
          serviceId={serviceId}
          serviceName={serviceName}
          openEnquiry={openEnquiry}
          onBookSpa={(currentSpaId, currentServiceId, currentServiceName) => {
            navigation.navigate('Login', {
              spaId: currentSpaId,
              serviceId: currentServiceId,
              serviceName: currentServiceName,
            });
          }}
          onBack={() => navigation.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF3EA',
  },
  container: {
    paddingBottom: 24,
  },
  containerTablet: {
    alignSelf: 'center',
    maxWidth: 720,
    width: '100%',
  },
});

export default SpaDetailsScreen;
