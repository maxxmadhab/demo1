-- ============================================================
-- Budhram — Phase 2: products + product_images + storage + RLS
-- ============================================================
-- Run in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
--
-- Creates:
--   public.products        (catalog items)
--   public.product_images  (one row per product image, ordered)
--   a product-images storage bucket + policies
--   Row Level Security + policies
-- ============================================================

-- 1. Catalog categories (enforced via CHECK constraint / allowed list)
CREATE TYPE public.product_category AS ENUM (
  'New Arrivals', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'
);

-- 2. Products table
CREATE TABLE IF NOT EXISTS public.products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  category         public.product_category NOT NULL,
  price            NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  material         TEXT NOT NULL DEFAULT '',
  gemstone         TEXT NOT NULL DEFAULT '',
  description      TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  dimensions       JSONB NOT NULL DEFAULT '{}'::jsonb,   -- {width,length,height,weight,stoneWeight}
  badge            TEXT,                                   -- 'New' | 'Best Seller' | 'Limited' | 'Iconic' | 'Bridal'
  is_new           BOOLEAN NOT NULL DEFAULT false,
  is_best_seller   BOOLEAN NOT NULL DEFAULT false,
  featured         BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Product images (separate table so a product can have many images)
CREATE TABLE IF NOT EXISTS public.product_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 4. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_set_updated_at ON public.products;
CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Public (anon) can only READ products that are visible.
-- Customers see all catalog rows (no status flag in this phase).
CREATE POLICY "Public can read products"
  ON public.products FOR SELECT
  USING (true);

-- Only admins can write products. Admin is validated via the profiles table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Admin insert
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin update
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin delete
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- product_images: only admins can write; anon can read the image URLs
CREATE POLICY "Public can read product_images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert product_images"
  ON public.product_images FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update product_images"
  ON public.product_images FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete product_images"
  ON public.product_images FOR DELETE
  USING (public.is_admin());

-- Grant usage to the anon/authenticated roles
GRANT SELECT ON public.products TO anon, authenticated, service_role;
GRANT SELECT ON public.product_images TO anon, authenticated, service_role;
GRANT ALL ON public.products TO authenticated, service_role;
GRANT ALL ON public.product_images TO authenticated, service_role;

-- ============================================================
-- 6. STORAGE BUCKET for product images
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
SELECT 'product-images', 'product-images', true
ON CONFLICT (id) DO NOTHING;

-- Public read of product images
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only admins can upload/update/delete in product-images
CREATE POLICY "Admins insert product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
