import { useMemo } from 'react';

export const useCallTimer = (durationInSeconds: number) => {
  const formattedTime = useMemo(() => {
    const m = Math.floor(durationInSeconds / 60);
    const s = durationInSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, [durationInSeconds]);

  return formattedTime;
};
