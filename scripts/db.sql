-- ============================================================
-- HEMI MOTOR — Supabase шема (реални податоци од hamachi.mk)
-- Извршете го во Supabase Dashboard → SQL Editor
-- ============================================================

-- ---------- ТАБЕЛА: производи (мапирани од Shopify / hamachi.mk) ----------
create table if not exists public.products (
  id bigint primary key,               -- Shopify product id
  handle text unique not null,         -- slug
  title text not null,
  category text,                       -- 'scooters' | 'motorcycles' | 'equipment'
  vendor text,                         -- бренд (HAMACHI, SYM, ZONTES, ITALJET...)
  product_type text,
  description_html text,               -- целосен опис од Shopify (HTML со спецификации)
  description_text text,               -- опис без HTML
  price numeric not null default 0,    -- цена во денари
  eur_price numeric,                   -- проценета цена во EUR
  compare_at_price numeric,            -- редовна цена (за попуст)
  available boolean default true,
  image_url text,
  images jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  subcategories jsonb not null default '[]'::jsonb, -- hamachi поткатегории
  cc_number integer,                   -- кубикажа (за филтри/сортирање)
  cc_display text,                     -- приказ (на пр. "49 cc")
  specs jsonb not null default '{}'::jsonb,  -- парсирани спецификации: power, torque, topSpeed, weight...
  updated_at timestamptz not null default now()
);

-- ---------- ТАБЕЛА: нарачки (за подоцна / е-трговија) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  city text not null,
  address text not null,
  note text,
  items jsonb not null,
  total numeric not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "products_public_select" on public.products;
create policy "products_public_select"
  on public.products for select
  using (true);

drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert"
  on public.orders for insert
  with check (true);

-- ИНДЕКСИ
create index if not exists idx_products_vendor on public.products (vendor);
create index if not exists idx_products_available on public.products (available);
create index if not exists idx_products_cc on public.products (cc_number);
create index if not exists idx_products_category on public.products (category);
