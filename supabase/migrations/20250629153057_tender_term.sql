/*
  # Create products table with complete schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, required)
      - `description` (text, optional)
      - `price` (numeric(10,2), required)
      - `image_url` (text, optional)
      - `category` (text, default 'supplements')
      - `stock_quantity` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to active products
    - Add policy for admin management of all products

  3. Indexes
    - Index on category for filtering
    - Index on is_active for filtering
    - Index on created_at for ordering
*/

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  category text DEFAULT 'supplements'::text,
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products USING btree (category);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products USING btree (is_active);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products USING btree (created_at);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active products
CREATE POLICY IF NOT EXISTS "Anyone can view active products"
  ON public.products
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create policy for admin management (requires admin_users table to exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users' AND table_schema = 'public') THEN
    -- Create admin management policy if admin_users table exists
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'products' 
      AND policyname = 'Admins can manage products'
    ) THEN
      CREATE POLICY "Admins can manage products"
        ON public.products
        FOR ALL
        TO authenticated
        USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));
    END IF;
  END IF;
END $$;

-- Insert some sample products if the table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.products LIMIT 1) THEN
    INSERT INTO public.products (name, description, price, image_url, category, stock_quantity, is_active) VALUES
    ('Ashwagandha Gummies', 'Premium ashwagandha gummies for stress relief and relaxation', 29.99, 'https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg', 'supplements', 50, true),
    ('Turmeric Capsules', 'High-quality turmeric capsules with curcumin for inflammation support', 24.99, 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg', 'supplements', 75, true),
    ('Elderberry Syrup', 'Natural elderberry syrup for immune system support', 19.99, 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg', 'supplements', 30, true),
    ('Ginseng Extract', 'Pure ginseng extract for energy and vitality', 34.99, 'https://images.pexels.com/photos/4021777/pexels-photo-4021777.jpeg', 'supplements', 25, true);
  END IF;
END $$;