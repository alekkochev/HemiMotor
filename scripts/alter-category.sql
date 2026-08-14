-- ALTER: додавање на колона „category“ на постоечката products табела
-- Извршете го во Supabase → SQL Editor (или користете ги двете изјави подолу)
alter table public.products
  add column if not exists category text;

-- Опционално: зачувај ги постоечките скутери како категорија 'scooters'
update public.products set category = 'scooters' where category is null;

create index if not exists idx_products_category on public.products (category);
