# HEMI MOTOR — Овластен Мото Центар 🏍️

Апликација (React 19 + Vite + Tailwind CSS v4) за **Hemi Motor** — овластен увозник и дистрибутер за Zontes, SYM,
Kove, QJMotor, HMC и Hamachi моторцикли и скутери. Генерирана во Google AI Studio и прилагодена со **реални податоци
од hamachi.mk** (Shopify).

## 🧱 Технологии

- **React 19 + Vite 6 + TypeScript**
- **Tailwind CSS v4**, GSAP, Motion, lucide-react
- **Supabase** — база на податоци (реални производи)
- **Shopify Storefront API** (јавни `products.json`/`collections.json` од hamachi.mk) — извор на податоци
- **GitHub Actions** — дневна автоматска синхронизација (03:00 UTC)
- **Google Gemini API** (`@google/genai`) — AI дијагностика

## 🚀 Поставување

### 1. Инсталирај зависности
```bash
npm install
```

### 2. Supabase проект + шема
1. Креирај проект на https://supabase.com (на пр. `hemi-motor`).
2. Во **SQL Editor** изврши ја целата содржина од `scripts/db.sql` (табели `products`, `orders` + RLS).
3. Од **Settings → API** земи: Project URL, `anon public` клуч и `service_role` клуч.

### 3. `.env` (копирај од `.env.example`)
```bash
Copy-Item .env.example .env
```
Пополни:
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` — за фронтендот
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE` — за синхронизациската скрипта (само на сервер!)
- `GEMINI_API_KEY` — ако се користи AI дијагностиката

### 4. Прва синхронизација на скутерите од hamachi
```bash
npm run sync
```
Влече **77+ скутери** од колекцијата „Скутери“ на hamachi.mk, ја извлекува кубикажата и ги парсира
спецификациите (моќност, брзина, тежина...) од HTML описите, па ги запишува во Supabase.

### 5. Стартувај
```bash
npm run dev   # → http://localhost:3000
```

### 6. Деплој на Vercel
1. Пушни го проектот на GitHub.
2. Vercel → **Add New Project** → изберете го репото → **Deploy**.
3. Во Vercel **Environment Variables** додај: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (и `GEMINI_API_KEY` ако треба).
4. Во GitHub repo **Settings → Secrets → Actions** додај: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`.

## 🔄 Автоматска синхронизација

`.github/workflows/sync-shopify.yml` се извршува **секој ден во 03:00 UTC** — ги ажурира цените, достапноста и
сликите, и ги брише производите што ги нема. Рачно: **Actions → Sync → Run workflow**, или локално `npm run sync`.

> 💡 Дневната синхронизација истовремено ја одржува Supabase базата будна (без 7-дневна пауза).

## ⚠️ Важно

- `service_role` клучот **никогаш** не смее да биде во `VITE_` променлива.
- Сликите се вчитуваат директно од Shopify CDN — не зафаќаат простор во Supabase.
- Без Supabase конфигурација апликацијата прикажува **демо податоци** (означени со „ПРЕГЛЕД (демо)“).

## 📁 Структура

```
├── .github/workflows/sync-shopify.yml   # дневна синхронизација
├── scripts/
│   ├── db.sql                           # Supabase шема
│   └── sync-shopify.mjs                 # Shopify → Supabase синхронизација
├── src/
│   ├── components/                      # Showroom, Shop, Modals, Footer...
│   ├── data/                            # демо податоци + преводи (mk/en/sq/de)
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase клиент
│   │   └── useMotorcycles.ts            # hook: реални податоци → Motorcycle[]
│   └── types.ts
└── .env.example
```
