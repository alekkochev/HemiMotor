import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, hasSupabase } from './supabase';

export interface PartsProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  priceEur: number;
}

interface PartsRow {
  id: number;
  title: string;
  image_url: string | null;
  price: number;
  eur_price: number | null;
}

const EUR_DEFAULT = 61.5;

/** Ги вчитува реалните резервни делови од Supabase (синхронизирани од hamachi.mk). */
export function usePartsProducts(): { parts: PartsProduct[] } {
  const [rows, setRows] = useState<PartsProduct[]>([]);

  const load = useCallback(() => {
    if (!hasSupabase) {
      setRows([]);
      return;
    }
    supabase
      .from('products')
      .select('id,title,image_url,price,eur_price')
      .eq('category', 'parts')
      .limit(60)
      .then(({ data, error }) => {
        if (error) {
          console.error('[HemiMotor] parts load error:', error.message);
          setRows([]);
        } else {
          setRows(
            ((data || []) as PartsRow[])
              .map((r) => ({
                id: String(r.id),
                title: r.title,
                image: r.image_url || '',
                price: r.price || 0,
                priceEur: r.eur_price || (r.price ? Math.round(r.price / EUR_DEFAULT) : 0),
              }))
              .filter((p) => p.image)
          );
        }
      });
  }, []);

  useEffect(load, [load]);

  const parts = useMemo(() => rows, [rows]);
  return { parts };
}
