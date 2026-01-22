import { useEffect, useState } from 'react';
import { fetchStats } from '../api/api';

export function useStatData(endpoint: string, from: Date, to: Date) {
  const [data, setData] = useState<{ completed: boolean; count: string }[]>();

  console.log(endpoint);
  useEffect(() => {
    if (!from || endpoint === undefined) return;

    async function load() {
      try {
        const fromStr = from?.toLocaleDateString('en-CA');
        const toStr = (to ?? from)?.toLocaleDateString('en-CA');
        const data = await fetchStats(endpoint, {
          from: fromStr,
          to: toStr,
        });

        setData(data as { completed: boolean; count: string }[]);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [endpoint, from, to]);

  return data;
}
