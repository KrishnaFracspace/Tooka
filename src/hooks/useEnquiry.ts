import { Alert } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { submitEnquiry as submitEnquiryRequest } from '../services/fakeEnquiryApi';
import { createPendingBooking as createPendingBookingEntry, saveEnquiry } from '../services/enquiryStorage';
import type { EnquiryFormValues, PendingEnquiry, SpaEnquiryContext } from '../types/Enquiry';

interface UseEnquiryOptions {
  spa: SpaEnquiryContext;
  onSuccess?: () => void;
}

export const useEnquiry = ({ spa, onSuccess }: UseEnquiryOptions) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitEnquiry = useCallback(
    async (values: EnquiryFormValues) => {
      setLoading(true);
      setSuccess(false);

      try {
        const result = await submitEnquiryRequest();
        if (!result.success) {
          throw new Error(result.message);
        }

        const pendingBooking = createPendingBookingEntry({
          spaId: spa.spaId,
          spaName: spa.spaName,
          spaImage: spa.spaImage,
          location: spa.location,
          serviceId: spa.serviceId,
          serviceName: spa.serviceName,
          customerName: values.name.trim(),
          customerEmail: values.email.trim(),
          enquiryMessage: values.message.trim(),
        });

        await saveEnquiry(pendingBooking);
        setSuccess(true);
        onSuccess?.();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to submit your enquiry.';
        Alert.alert('Enquiry failed', message);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, spa],
  );

  const reset = useCallback(() => {
    setSuccess(false);
    setLoading(false);
  }, []);

  const closeSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  const saveToAsyncStorage = useCallback(async (pendingEnquiry: PendingEnquiry) => {
    await saveEnquiry(pendingEnquiry);
  }, []);

  const createPendingBooking = useCallback((values: EnquiryFormValues) => {
    return createPendingBookingEntry({
      spaId: spa.spaId,
      spaName: spa.spaName,
      spaImage: spa.spaImage,
      location: spa.location,
      serviceId: spa.serviceId,
      serviceName: spa.serviceName,
      customerName: values.name.trim(),
      customerEmail: values.email.trim(),
      enquiryMessage: values.message.trim(),
    });
  }, [spa]);

  return useMemo(() => ({
    loading,
    success,
    submitEnquiry,
    saveToAsyncStorage,
    createPendingBooking,
    closeSuccess,
    reset,
  }), [closeSuccess, createPendingBooking, loading, reset, saveToAsyncStorage, submitEnquiry, success]);
};
