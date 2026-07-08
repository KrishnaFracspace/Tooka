import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import EnquiryModal from '../../components/EnquiryModal';
import EnquirySuccessModal from '../../components/EnquirySuccessModal';
import { useEnquiry } from '../../hooks/useEnquiry';
import type { EnquiryFormValues } from '../../types/Enquiry';

type SpaDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SpaDetails'>;
type SpaDetailsRouteProp = RouteProp<RootStackParamList, 'SpaDetails'>;

function SpaDetailsScreen(): React.ReactElement {
  const navigation = useNavigation<SpaDetailsNavigationProp>();
  const route = useRoute<SpaDetailsRouteProp>();
  const { spaId, serviceId, serviceName, openEnquiry } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { spa, loading: spaLoading, refreshing, error, refetch, onRefresh } = useSpaDetails(spaId);
  const { isAuthenticated, user } = useAuth();
  const [enquiryVisible, setEnquiryVisible] = useState(false);

  const [selectedService, setSelectedService] = useState<{ id?: string; name?: string }>({
      id: serviceId,
      name: serviceName,
    });
  
    useEffect(() => {
      setSelectedService({ id: serviceId, name: serviceName });
    }, [serviceId, serviceName]);
  

  useEffect(() => {
    if (openEnquiry) {
      navigation.setParams({ openEnquiry: false });
    }
  }, [navigation, openEnquiry]);

//   useEffect(() => {
//   console.log('SPA DATA', spa);
// }, [spa]);

  const enquiryDefaults = useMemo(
      () => ({
        name: user?.userName ?? '',
        email: user?.email ?? '',
        message: '',
      }),
      [user?.userName, user?.email],
    );

  const enquiryContext = useMemo(
    () => ({
      spaId,
      spaName: spa?.name ?? 'Spa',
      spaImage: spa?.cover_photo_url ?? '',
      location: spa?.locality_name ?? spa?.city_name ?? 'Hyderabad',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
    }),
    [spa?.city_name, spa?.cover_photo_url, spa?.locality_name, spa?.name, selectedService.id, selectedService.name, spaId],
  );

  const { loading: enquiryLoading, success, submitEnquiry, reset, closeSuccess } = useEnquiry({
    spa: enquiryContext,
    onSuccess: () => {
      setEnquiryVisible(false);
    },
  });

  const handleSubmitEnquiry = useCallback(
    async (values: EnquiryFormValues) => {
      await submitEnquiry(values);
    },
    [submitEnquiry],
  );

  const handleCloseEnquiry = useCallback(() => {
    if (enquiryLoading) {
      return;
    }

    setEnquiryVisible(false);
    reset();
  }, [enquiryLoading, reset]);

  const handleSuccessDone = useCallback(() => {
    closeSuccess();
    reset();
  }, [closeSuccess, reset]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, isTablet && styles.containerTablet]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFAA26" />}
      >
        <SpaDetailsContent
          spa={spa}
          loading={enquiryLoading}
          error={error}
          onRetry={refetch}
          spaId={spaId}
          serviceId={serviceId}
          serviceName={serviceName}
          openEnquiry={openEnquiry}
          // onBookSpa={(currentSpaId, currentServiceId, currentServiceName) => {
          //   navigation.navigate('Login', {
          //     spaId: currentSpaId,
          //     serviceId: currentServiceId,
          //     serviceName: currentServiceName,
          //   });
          // }}
          onBookSpa={(currentSpaId, currentServiceId, currentServiceName) => {

              if (isAuthenticated) {
                  // setEnquiryVisible(true);
                  // return;
                  navigation.navigate('BookingScreen');
                  return;
              }

              navigation.navigate('Login', {
                  spaId: currentSpaId,
                  serviceId: currentServiceId,
                  serviceName: currentServiceName,
              });
          }}
          onBack={() => navigation.goBack()}
        />
      </ScrollView>
      <EnquiryModal
        visible={enquiryVisible}
        onClose={handleCloseEnquiry}
        onSubmit={handleSubmitEnquiry}
        defaultValues={enquiryDefaults}
        loading={enquiryLoading}
      />
      <EnquirySuccessModal visible={success} onDone={handleSuccessDone} />
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
