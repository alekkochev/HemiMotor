import { useCallback, useEffect, useMemo, useState } from 'react'
import { Motorcycle } from '../types'
import { supabase, hasSupabase } from './supabase'
import { MOTORCYCLES } from '../data/motorcycles'

/** Ред од Supabase `products` табелата (мапиран од Shopify). */
interface ProductRow {
  id: number
  handle: string
  title: string
  category: string | null
  vendor: string | null
  product_type: string | null
  description_html: string | null
  description_text: string | null
  price: number
  eur_price: number | null
  compare_at_price: number | null
  available: boolean
  image_url: string | null
  images: string[]
  tags: string[]
  subcategories: string[]
  cc_number: number | null
  cc_display: string | null
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

/** Мапирање на Shopify-ред од Supabase во богатиот Motorcycle облик на апликацијата. */
function mapRowToMotorcycle(row: ProductRow): Motorcycle {
  const specs = row.specs || {}
  const cc = row.cc_number || 0
  const isMoto = row.category === 'motorcycles'

  // Поткатегорија: скутери по кубикажа, моторцикли по колекции
  let subCategory: Motorcycle['subCategory']
  if (isMoto) {
    const scs = row.subcategories || []
    if (scs.some((s) => s.includes('kros') || s.includes('enduro') || s.includes('detski'))) subCategory = 'cross-enduro'
    else if (scs.some((s) => s.includes('choper'))) subCategory = 'cruiser-chopper'
    else if (cc >= 440) subCategory = 'adventure-rally'
    else subCategory = 'street-naked'
  } else {
    subCategory = (cc <= 50 ? 'scooter-50' : cc <= 200 ? 'scooter-125-200' : 'scooter-maxi-300') as Motorcycle['subCategory']
  }

  return {
    id: String(row.id),
    handle: row.handle,
    name: row.title,
    brand: (row.vendor as Motorcycle['brand']) || 'HAMACHI',
    subtitle: row.product_type || 'Овластен дилер · Гаранција и сервис',
    category: isMoto ? 'motorcycles' : 'scooters',
    subCategory,
    ccNumber: cc,
    displacement: row.cc_display || (cc ? `${cc} cc` : '—'),
    priceMkd: row.price,
    priceMkdFormatted: fmtMkd(row.price),
    priceEur: row.eur_price ?? Math.round(row.price / EUR_DEFAULT),
    priceEurFormatted: fmtEur(row.eur_price ?? Math.round(row.price / EUR_DEFAULT)),
    oldPriceMkd: row.compare_at_price ?? undefined,
    monthlyInstallmentMkd: row.price ? Math.round(row.price / 36) : 0,
    engine: specs.engine || '—',
    engineType: row.subcategories?.some((s) => s.includes('50cc-2t')) ? '2-тактен' : '4-тактен',
    cooling: specs.cooling || '—',
    power: specs.power || '—',
    torque: specs.torque || '—',
    topSpeed: specs.topSpeed || '—',
    acceleration0100: '—',
    weight: specs.weight || '—',
    fuelCapacity: specs.fuelCapacity || '—',
    brakes: specs.brakes || '—',
    tires: specs.tires || '—',
    image: row.image_url || '',
    gallery: row.images?.length ? row.images : row.image_url ? [row.image_url] : [],
    description: row.description_text || row.title,
    descriptionHtml: row.description_html || undefined,
    features: [],
    inStock: row.available,
    available: row.available,
    stockSalons: [],
    warrantyYears: 2,
    badge: row.compare_at_price && row.compare_at_price > row.price ? '🔥 ПОПУСТ' : undefined,
    telemetry: {
      maxRpm: 0,
      compressionRatio: '—',
      brakes: specs.brakes || '—',
      suspension: '—',
      electronics: '—',
      dynoPeakHp: 0,
    },
    b2bEligible: false,
  }
}

/** Ги вчитува реалните скутери од Supabase. Доколку нема конфигурирано Supabase → користи демо податоци. */
export function useMotorcycles(): { motorcycles: Motorcycle[]; loading: boolean; usingDemo: boolean } {
  const [rows, setRows] = useState<ProductRow[] | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    if (!hasSupabase) {
      setLoading(false)
      setRows(null)
      return
    }
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .order('available', { ascending: false })
      .order('price', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('[HemiMotor] Supabase load error:', error.message)
          setRows(null)
        } else {
          setRows((data as ProductRow[]) || null)
        }
        setLoading(false)
      })
  }, [])

  useEffect(load, [load])

  const { motorcycles, usingDemo } = useMemo(() => {
    if (rows && rows.length) {
      // Само скутери + моторцикли (опремата е во ShopSection)
      const vehicles = rows.filter((r) => r.category !== 'equipment').map(mapRowToMotorcycle)
      if (vehicles.length) return { motorcycles: vehicles, usingDemo: false }
    }
    // Без база или празна база → демо податоци (апликацијата се гледа и без Supabase)
    return { motorcycles: MOTORCYCLES, usingDemo: true }
  }, [rows])

  return { motorcycles, loading, usingDemo }
}
