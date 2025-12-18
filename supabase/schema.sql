-- Esquema principal para Supabase (PostgreSQL)

CREATE TYPE public.user_role AS ENUM ('admin', 'buyer');
CREATE TYPE public.product_status AS ENUM ('active', 'inactive');
CREATE TYPE public.order_status AS ENUM (
  'pending_payment',
  'waiting_confirmation',
  'paid',
  'cancelled'
);

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'buyer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_role_idx ON public.users (role);

CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  status public.product_status NOT NULL DEFAULT 'active',
  is_accessory BOOLEAN NOT NULL DEFAULT TRUE,
  is_spare_part BOOLEAN NOT NULL DEFAULT FALSE,
  category_id BIGINT REFERENCES public.categories (id),
  main_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_status_idx ON public.products (status);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products (category_id);
CREATE INDEX IF NOT EXISTS products_stock_idx ON public.products (stock);

CREATE TABLE IF NOT EXISTS public.used_motorcycles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT,
  mileage INT,
  price NUMERIC(12, 2),
  description TEXT,
  status public.product_status NOT NULL DEFAULT 'active',
  main_image_url TEXT,
  images_urls TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS used_motorcycles_status_idx
  ON public.used_motorcycles (status);

CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users (id),
  total_amount NUMERIC(12, 2) NOT NULL,
  status public.order_status NOT NULL DEFAULT 'pending_payment',
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_user_idx ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);

CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES public.products (id),
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_product_idx ON public.order_items (product_id);

CREATE TABLE IF NOT EXISTS public.banners (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS banners_active_idx ON public.banners (active);
CREATE INDEX IF NOT EXISTS banners_position_idx ON public.banners (position);



