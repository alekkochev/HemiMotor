/**
 * HEMI MOTOR — Синхронизација од hamachi.mk (Shopify) → Supabase
 *
 * Категории што се синхронизираат:
 *   1. Скутери      (главна колекција „skuteri“ + поткатегории)
 *   2. Моторцикли   (главна колекција „motocikli“ + поткатегории — без ATV)
 *   3. Мото опрема  (кациги, јакни, обувки, ракавици, панталони, опрема)
 *   4. Резервни делови (parts.mk — скрејпирани наслови, цени и слики од prodavnica)
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

const PARTS_MK_BASE = 'https://parts.mk'
const PARTS_MK_SKIP = /кацига|ракавици|јакна|панталони|обувки|чизми|визир|балаклава|очила|чанти|ранец/i
/** ID-ја на категориите на делови на parts.mk (WP REST API) што се синхронизираат. */
const PARTS_MK_CATEGORY_IDS = [581, 582, 583, 355, 339, 422, 316, 394, 343, 353, 467, 434, 357, 450, 337, 317, 408, 315, 490, 430]
const PARTS_MK_MAX_TOTAL = 120

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
    .replace(/<br\b[^>]*>/gi, '\n')
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

  const keyMap = [
    { keys: ['engine type', 'engine', 'тип на мотор', 'тип мотор', 'мотор'], field: 'engine' },
    { keys: ['displacement', 'engine displacement', 'зафатнина', 'работна зафатнина'], field: 'displacement' },
    { keys: ['max power', 'maximum power', 'power', 'максимална моќност', 'максимална моћност', 'максимална мокност', 'моќност', 'моћност'], field: 'power' },
    { keys: ['max torque', 'maximum torque', 'torque', 'вртежен момент', 'максимален вртежен момент'], field: 'torque' },
    { keys: ['max speed', 'maximum speed', 'top speed', 'максимална брзина', 'макс. брзина', 'брзина'], field: 'topSpeed' },
    { keys: ['weight', 'net weight', 'gross weight', 'тежина', 'маса'], field: 'weight' },
    { keys: ['fuel tank', 'tank capacity', 'fuel capacity', 'fuel', 'резервоар', 'резервоар за гориво'], field: 'fuelCapacity' },
    { keys: ['brake', 'brakes', 'сопирачки'], field: 'brakes' },
    { keys: ['tire', 'tyre', 'tires', 'гуми', 'бандажи', 'тркала'], field: 'tires' },
    { keys: ['cooling', 'cooling system', 'ладење', 'систем за ладење'], field: 'cooling' },
  ]

  const tryMatch = (rawKey, value) => {
    if (!value) return false
    for (const { keys, field } of keyMap) {
      if (keys.some((k) => rawKey.includes(k)) && !specs[field]) {
        specs[field] = value
        return true
      }
    }
    return false
  }

  // 1) Табели: <td><strong>Клуч</strong></td><td>вредност</td>
  const rowRe = /<tr[^>]*>\s*<td[^>]*>\s*<strong>([^<]+)<\/strong>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi
  let m
  while ((m = rowRe.exec(bodyHtml)) !== null) {
    const rawKey = stripHtml(m[1]).toLowerCase().replace(/[:\s]+$/g, '').replace(/\s+/g, ' ').trim()
    tryMatch(rawKey, stripHtml(m[2]))
  }

  // 2) Fallback: линии „Клуч: вредност“ (формат со <br> во <p>) — секогаш се обидува да пополни
  {
    const text = (bodyHtml || '')
      .replace(/<br\b[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
    for (const line of text.split('\n')) {
      const clean = line.replace(/\s+/g, ' ').trim()
      if (clean.length < 3 || clean.length > 200) continue
      const colon = clean.indexOf(':')
      if (colon <= 1 || colon > 40) continue
      const key = clean.slice(0, colon).toLowerCase().trim()
      const value = clean.slice(colon + 1).trim()
      tryMatch(key, value)
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

  // Дедупликација: hamachi чува иста слика во повеќе димензии (на пр. „-300x300“, „-760x520“)
  const seen = new Set()
  const images = (sp.images || [])
    .map((i) => i.src)
    .filter((src) => {
      if (!src) return false
      const norm = src.replace(/-\d+x\d+(?=\.[a-z0-9]+(\?|$))/i, '')
      if (seen.has(norm)) return false
      seen.add(norm)
      return true
    })
  // Санитизација на описот: тргаме inline style атрибути (темни бои како color:#000) за контраст на темната тема
  const sanitizedHtml = (sp.body_html || '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
  const specs = parseSpecs(sp.body_html)
  const { cc, display } = category === 'equipment' || category === 'parts' ? { cc: null, display: null } : extractCc(sp, subcategories)

  return {
    id: sp.id,
    handle: sp.handle,
    title: sp.title,
    category,
    vendor: sp.vendor || null,
    product_type: sp.product_type || null,
    description_html: sanitizedHtml || null,
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

async function fetchPartsProducts() {
  const byId = new Map()
  const out = []
  const push = (p) => {
    if (out.length >= PARTS_MK_MAX_TOTAL) return
    out.push(p)
  }
  for (const catId of PARTS_MK_CATEGORY_IDS) {
    const url = `${PARTS_MK_BASE}/wp-json/wp/v2/product?product_cat=${catId}&per_page=12&_embed=1&page=1`
    let items
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) HemiMotor-Sync/1.0',
          Accept: 'application/json',
        },
      })
      if (!res.ok) {
        console.warn(`   ⚠️ cat ${catId}: HTTP ${res.status}`)
        continue
      }
      items = await res.json()
    } catch (e) {
      console.warn(`   ⚠️ cat ${catId}: ${e.message}`)
      continue
    }
    let catItems = 0
    for (const p of items || []) {
      if (byId.has(p.id)) continue
      const media = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]
      const sizes = (media && media.media_details && media.media_details.sizes) || {}
      const img =
        (sizes.woocommerce_thumbnail && sizes.woocommerce_thumbnail.source_url) ||
        (sizes.medium && sizes.medium.source_url) ||
        (sizes.thumbnail && sizes.thumbnail.source_url) ||
        (media && media.source_url) ||
        null
      if (!img || /placehold|изработка|placeholder/i.test(img)) continue
      const title = ((p.title && p.title.rendered) || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      if (!title || PARTS_MK_SKIP.test(title)) continue
      byId.set(p.id, true)
      push({
        id: 900000 + out.length + 1,
        handle: `parts-mk-${p.id}`,
        title,
        category: 'parts',
        vendor: 'Parts.mk',
        product_type: 'Резервен дел',
        description_html: null,
        description_text: title,
        price: 0,
        eur_price: null,
        compare_at_price: null,
        available: true,
        image_url: img,
        images: [img],
        tags: [],
        subcategories: [],
        cc_number: null,
        cc_display: null,
        specs: {},
        updated_at: new Date().toISOString(),
      })
      catItems++
    }
    if (catItems > 0) console.log(`   • cat ${catId}: ${catItems}`)
  }
  return out
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

  console.log('🔩 Резервни делови (parts.mk)...')
  const parts = await fetchPartsProducts()
  console.log(`   • вкупно: ${parts.length}`)
  all.push(...parts)

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
      `${restUrl}?select=id,handle,category&offset=${offset}&limit=1000`,
      { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` } },
    )
    if (!listRes.ok) break
    const rows = await listRes.json()
    if (!rows.length) break
    for (const r of rows) {
      // Деловите од parts.mk не се бришат при привремен пад на скрејперот
      if (!currentHandles.has(r.handle) && r.category !== 'parts') staleIds.push(r.id)
    }
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
