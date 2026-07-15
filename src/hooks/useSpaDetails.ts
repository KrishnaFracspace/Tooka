import { useCallback, useEffect, useMemo, useState } from 'react';
import SpaApi from '../api/SpaApi';
import type { SpaDetails } from '../types/spaDetails';

export function useSpaDetails(spaId: string) {
  const [spa, setSpa] = useState<SpaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaDetails = useCallback(
    async ({ refresh }: { refresh?: boolean } = {}) => {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const response = await SpaApi.getSpaDetails(spaId);
        // console.log("SpaDetails: ", response);
        setSpa(response ?? null);

        if (__DEV__) {
          console.log(`[useSpaDetails] fetched spa details for ${spaId}`, response);
        }
      } catch (fetchError) {
        if (__DEV__) {
          console.log('[useSpaDetails] error fetching spa details', fetchError);
        }

        setError('Unable to load spa details.');
        setSpa(null);
      } finally {
        if (refresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [spaId],
  );

  useEffect(() => {
    fetchSpaDetails();
  }, [fetchSpaDetails]);

  const refetch = useCallback(() => fetchSpaDetails(), [fetchSpaDetails]);
  const onRefresh = useCallback(() => fetchSpaDetails({ refresh: true }), [fetchSpaDetails]);

  return useMemo(
    () => ({
      spa,
      loading,
      refreshing,
      error,
      refetch,
      onRefresh,
    }),
    [spa, loading, refreshing, error, refetch, onRefresh],
  );
}
