import { useCallback, useEffect, useMemo, useState } from 'react';
import SpaApi from '../api/SpaApi';
import type { Spa } from '../types/spa';

const DEFAULT_CITY = 'Hyderabad';

export function useSpaDiscovery(city: string = DEFAULT_CITY) {
  const [spas, setSpas] = useState<Spa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpas = useCallback(
    async ({ refresh }: { refresh?: boolean } = {}) => {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const response = await SpaApi.getSpasByCity(city);
        const spaList = Array.isArray(response) ? response : [];
        setSpas(spaList);

        if (__DEV__) {
          console.log(`[useSpaDiscovery] fetched ${spaList.length} spas from ${city}`);
        }
      } catch (fetchError) {
        if (__DEV__) {
          console.log('[useSpaDiscovery] error fetching spas', fetchError);
        }

        setError('Something went wrong. Please try again.');
        setSpas([]);
      } finally {
        if (refresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [city],
  );

  useEffect(() => {
    fetchSpas();
  }, [fetchSpas]);

  const refetch = useCallback(() => fetchSpas(), [fetchSpas]);

  const onRefresh = useCallback(() => fetchSpas({ refresh: true }), [fetchSpas]);

  return useMemo(
    () => ({
      spas,
      loading,
      error,
      refreshing,
      refetch,
      onRefresh,
    }),
    [spas, loading, error, refreshing, refetch, onRefresh],
  );
}
