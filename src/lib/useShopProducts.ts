import { useCallback, useEffect, useMemo, useState } from 'react'
import { ShopProduct } from '../types'
import { supabase, hasSupabase } from './supabase'
import { SHOP_PRODUCTS } from '../data/shopProducts'

interface EquipmentRow {
  id: number
  handle: string
  title: string
  vendor: string | null
  description_text: string | null
  price: number
  eur_price: number | null
  compare_at_price: number | null
  available: boolean
  image_url: string | null
  subcategories: string[]
  specs: Record<string, string> | null
}

const EUR_DEFAULT = 61.5

function fmtMkd(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—'
  return Math.round(n).toLocaleString('mk-MK') + ' ден.'
}
function fmtEur(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—'
  return n.toLocaleString('de-DE') + ' €'
}

/** Мапирање на ред од опрема (Supabase) во ShopProduct облик. */
function mapRowToShopProduct(row: EquipmentRow): ShopProduct {
  const scs = row.subcategories || []
  const isHelmet = scs.some((s) => s.includes('kacigi') || s.includes('helmets'))
  const isApparel = scs.some((s) =>
    ['jakni', 'obuvki', 'rakavici', 'pantaloni', 'zashtitna-oprema'].some((k) => s === k),
  )

  const category: ShopProduct['category'] = isHelmet ? 'helmets' : isApparel ? 'apparel' : 'accessories'
  const categoryLabel = isHelmet ? 'Мото Кациги' : isApparel ? 'Облека & Заштита' : 'Мото Опрема'

  return {
    id: String(row.id),
    name: row.title,
    brand: row.vendor || 'HAMACHI',
    category,
    categoryLabel,
    priceMkd: row.price,
    priceMkdFormatted: fmtMkd(row.price),
    priceEur: row.eur_price ?? Math.round(row.price / EUR_DEFAULT),
    priceEurFormatted: fmtEur(row.eur_price ?? Math.round(row.price / EUR_DEFAULT)),
    oldPriceMkd: row.compare_at_price ?? undefined,
    image: row.image_url || '',
    inStock: row.available,
    stockCount: 0,
    compatibility: '',
    description: row.description_text || row.title,
    specifications: row.specs || {},
    rating: 0,
    reviewsCount: 0,
  }
}

/** Вчитува мото опрема од Supabase (категорија 'equipment'). Демо fallback без база. */
export function useShopProducts(): { shopProducts: ShopProduct[]; usingDemo: boolean } {
  const [rows, setRows] = useState<EquipmentRow[] | null>(null)

  const load = useCallback(() => {
    if (!hasSupabase) {
      setRows(null)
      return
    }
    supabase
      .from('products')
      .select('*')
      .eq('category', 'equipment')
      .order('available', { ascending: false })
      .order('title', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('[HemiMotor] Shop load error:', error.message)
          setRows(null)
        } else {
          setRows((data as EquipmentRow[]) || null)
        }
      })
  }, [])

  useEffect(load, [load])

  return useMemo(() => {
    if (rows && rows.length) {
      return { shopProducts: rows.map(mapRowToShopProduct), usingDemo: false }
    }
    return { shopProducts: SHOP_PRODUCTS, usingDemo: true }
  }, [rows])
}
