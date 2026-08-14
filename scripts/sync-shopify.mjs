/**
 * HEMI MOTOR — Синхронизација од hamachi.mk (Shopify) → Supabase
 *
 * Категории што се синхронизираат:
 *   1. Скутери      (главна колекција „skuteri“ + поткатегории)
 *   2. Моторцикли   (главна колекција „motocikli“ + поткатегории — без ATV)
 *   3. Мото опрема  (кациги, јакни, обувки, ракавици, панталони, опрема)
 *
 * Користење: npm run sync  (или node scripts/sync-shopify.mjs)
 * Потребни env: SUPABASE_URL, SUPABASE_SERVICE_ROLE (види .env.example)
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadDotEnv() {
  const envPath = resolve(__dirname, '..', '.env')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}
loadDotEnv()

const SHOPIFY_BASE = (process.env.SHOPIFY_BASE_URL || 'https://hamachi.mk').replace(/\/+$/, '')
const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE
const MKD_PER_EUR = 61.5

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('❌ Недостасува SUPABASE_URL или SUPABASE_SERVICE_ROLE (види .env.example)')
  process.exit(1)
}

/** Конфигурација на категориите: главна колекција + поткатегории за означување. */
const CATEGORIES = {
  scooters: {
    main: 'skuteri',
    subcats: [
      'skuteri-50cc-2t',
      'skuteri-50cc-4t',
      'skuteri-125cc',
      'elektrichni-skuteri',
      'maxi-skuteri',
      'sportski-skuteri',
      'retro-skuteri',
      'sym-skuteri',
      'zontes-skuteri',
    ],
  },
  motorcycles: {
    main: 'motocikli',
    subcats: [
      'kros',
      'enduro-modeli',
      'detski-kros-modeli',
      'choper',
      'zontes-motocikli',
      'kove',
      'qj',
      'benda',
      'italjet',
    ],
  },
}

/** Колекции на мото опрема (без главна — сите влегуваат). */
const EQUIPMENT_COLLECTIONS = [
  'kacigi',
  'hmc-kacigi',
  'zatvoreni-kacigi',
  'otvoreni-kacigi',
  'modularni-kacigi',
  'mt-helmets',
  'moto-oprema',
  'jakni',
  'obuvki',
  'rakavici',
  'pantaloni',
  'zashtitna-oprema',
]

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'HemiMotor-Sync/1.0' } })
  if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`)
  return res.json()
}

async function fetchCollectionProducts(collectionHandle) {
  const products = []
  let page = 1
  for (;;) {
    const url = `${SHOPIFY_BASE}/collections/${encodeURIComponent(collectionHandle)}/products.json?limit=250&page=${page}`
    const data = await fetchJson(url)
    const batch = data.products || []
    products.push(...batch)
    if (batch.length < 250) break
    page++
    if (page > 20) break
  }
  return products
}

// ---------- Парсирање на спецификации од HTML опис ----------
function stripHtml(html) {
  return (html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseSpecs(bodyHtml) {
  const specs = {}
  if (!bodyHtml) return specs
  const rowRe = /<tr[^>]*>\s*<td[^>]*>\s*<strong>([^<]+)<\/strong>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi
  const keyMap = [
    { keys: ['тип на мотор', 'тип мотор', 'мотор'], field: 'engine' },
    { keys: ['работна зафатнина', 'зафатнина'], field: 'displacement' },
    { keys: ['максимална моќност', 'максимална моћност', 'максимална мокност', 'моќност', 'моћност'], field: 'power' },
    { keys: ['вртежен момент', 'максимален вртежен момент'], field: 'torque' },
    { keys: ['максимална брзина', 'макс. брзина', 'брзина'], field: 'topSpeed' },
    { keys: ['тежина', 'маса'], field: 'weight' },
    { keys: ['резервоар', 'резервоар за гориво'], field: 'fuelCapacity' },
    { keys: ['сопирачки'], field: 'brakes' },
    { keys: ['гуми', 'бандажи', 'тркала'], field: 'tires' },
    { keys: ['ладење', 'систем за ладење'], field: 'cooling' },
  ]
  let m
  while ((m = rowRe.exec(bodyHtml)) !== null) {
    const rawKey = stripHtml(m[1]).toLowerCase().replace(/\s+/g, ' ').trim()
    const value = stripHtml(m[2])
    if (!value) continue
    for (const { keys, field } of keyMap) {
      if (keys.some((k) => rawKey.includes(k)) && !specs[field]) {
        specs[field] = value
        break
      }
    }
  }
  return specs
}

// ---------- Кубикажа ----------
function extractCc(product, subcategories) {
  if (subcategories.some((s) => s.includes('50cc'))) return { cc: 50, display: '50 cc' }
  if (subcategories.includes('skuteri-125cc')) return { cc: 125, display: '125 cc' }
  const typeNum = product.product_type ? product.product_type.match(/(\d{2,4})/) : null
  if (typeNum) {
    const n = Number(typeNum[1])
    return { cc: n, display: `${n} cc` }
  }
  const nums = [...product.title.matchAll(/(\d{2,4})/g)].map((m) => Number(m[1]))
  const valid = nums.find((n) => n >= 40)
  if (valid) return { cc: valid, display: `${valid} cc` }
  return { cc: null, display: null }
}

function mapProduct(sp, category, subcategories) {
  const variant =
    sp.variants && sp.variants.length
      ? sp.variants.reduce((min, v) => {
          const p = Number(v.price) || 0
          return p < (min?.price ?? Infinity) ? { ...v, price: p } : min
        }, null)
      : null

  const price = variant ? Number(variant.price) || 0 : 0
  const compareAt = variant?.compare_at_price ? Number(variant.compare_at_price) : null
  const available = variant ? Boolean(variant.available) : true
  const images = (sp.images || []).map((i) => i.src).filter(Boolean)
  const specs = parseSpecs(sp.body_html)
  const { cc, display } = category === 'equipment' ? { cc: null, display: null } : extractCc(sp, subcategories)

  return {
    id: sp.id,
    handle: sp.handle,
    title: sp.title,
    category,
    vendor: sp.vendor || null,
    product_type: sp.product_type || null,
    description_html: sp.body_html || null,
    description_text: stripHtml(sp.body_html) || null,
    price,
    eur_price: price ? Math.round(price / MKD_PER_EUR) : null,
    compare_at_price: compareAt && compareAt > price ? compareAt : null,
    available,
    image_url: images[0] || null,
    images,
    tags: sp.tags || [],
    subcategories,
    cc_number: cc,
    cc_display: display,
    specs,
    updated_at: new Date().toISOString(),
  }
}

async function fetchCategoryProducts(categoryKey) {
  const { main, subcats } = CATEGORIES[categoryKey]
  const subcatMap = new Map()
  for (const sc of subcats) {
    try {
      const prods = await fetchCollectionProducts(sc)
      for (const p of prods) {
        const arr = subcatMap.get(p.handle) || []
        if (!arr.includes(sc)) arr.push(sc)
        subcatMap.set(p.handle, arr)
      }
      console.log(`   • поткатегорија ${sc}: ${prods.length}`)
    } catch (e) {
      console.warn(`   ⚠️ ${sc}: ${e.message}`)
    }
  }
  const mainProducts = await fetchCollectionProducts(main)
  return mainProducts.map((p) => mapProduct(p, categoryKey, subcatMap.get(p.handle) || []))
}

async function fetchEquipmentProducts() {
  const byHandle = new Map()
  for (const col of EQUIPMENT_COLLECTIONS) {
    try {
      const prods = await fetchCollectionProducts(col)
      for (const p of prods) {
        const existing = byHandle.get(p.handle)
        if (existing) {
          if (!existing.subcategories.includes(col)) existing.subcategories.push(col)
        } else {
          byHandle.set(p.handle, mapProduct(p, 'equipment', [col]))
        }
      }
      console.log(`   • ${col}: ${prods.length}`)
    } catch (e) {
      console.warn(`   ⚠️ ${col}: ${e.message}`)
    }
  }
  return Array.from(byHandle.values())
}

async function main() {
  console.log('🚀 HEMI MOTOR sync — старт')

  const all = []

  console.log('🛵 Скутери...')
  const scooters = await fetchCategoryProducts('scooters')
  console.log(`   • вкупно: ${scooters.length}`)
  all.push(...scooters)

  console.log('🏍️ Моторцикли...')
  const motorcycles = await fetchCategoryProducts('motorcycles')
  console.log(`   • вкупно: ${motorcycles.length}`)
  all.push(...motorcycles)

  console.log('🧥 Мото опрема...')
  const equipment = await fetchEquipmentProducts()
  console.log(`   • вкупно: ${equipment.length}`)
  all.push(...equipment)

  const byCat = {}
  for (const p of all) byCat[p.category] = (byCat[p.category] || 0) + 1
  console.log('📊 Вкупно по категории:', JSON.stringify(byCat))

  console.log('💾 Запишувам во Supabase...')
  const restUrl = `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/products`
  const headers = {
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates',
  }

  let written = 0
  for (let i = 0; i < all.length; i += 100) {
    const chunk = all.slice(i, i + 100)
    const res = await fetch(restUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(chunk),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Supabase upsert HTTP ${res.status}: ${text.slice(0, 300)}`)
    }
    written += chunk.length
    console.log(`   • upsert ${written}/${all.length}`)
  }

  console.log('🧹 Чистам производи што веќе ги нема...')
  const currentHandles = new Set(all.map((p) => p.handle))
  let offset = 0
  const staleIds = []
  for (;;) {
    const listRes = await fetch(
      `${restUrl}?select=id,handle&offset=${offset}&limit=1000`,
      { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` } },
    )
    if (!listRes.ok) break
    const rows = await listRes.json()
    if (!rows.length) break
    for (const r of rows) if (!currentHandles.has(r.handle)) staleIds.push(r.id)
    offset += rows.length
    if (rows.length < 1000) break
  }
  if (staleIds.length) {
    await fetch(restUrl, {
      method: 'DELETE',
      headers: { ...headers, Prefer: 'count=exact' },
      body: JSON.stringify({ id: { in: staleIds } }),
    })
    console.log(`   • избришани: ${staleIds.length}`)
  } else {
    console.log('   • нема за бришење')
  }

  console.log(`✅ Готово: ${all.length} производи синхронизирани.`)
}

main().catch((e) => {
  console.error('❌ Грешка:', e.message)
  process.exit(1)
})
