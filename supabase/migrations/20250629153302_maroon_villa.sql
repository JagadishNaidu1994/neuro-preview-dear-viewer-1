/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text, optional)
      - `price` (numeric, required)
      - `image_url` (text, optional)
      - `category` (text, default 'supplements')
      - `stock_quantity` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to active products
    - Add policy for admin management (if admin_users table exists)

  3. Sample Data
    - Insert sample products if table is empty
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

-- Create policies with proper existence checks
DO $$
BEGIN
  -- Create policy for public read access to active products
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Anyone can view active products'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Anyone can view active products"
      ON public.products
      FOR SELECT
      TO public
      USING (is_active = true);
  END IF;

  -- Create policy for admin management (requires admin_users table to exist)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users' AND table_schema = 'public') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'products' 
      AND policyname = 'Admins can manage products'
      AND schemaname = 'public'
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
    ('Focus Mushroom Gummy Delights', 'Premium mushroom gummies for enhanced focus and mental clarity', 32.00, 'https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg', 'supplements', 50, true),
    ('Chill Mushroom Gummy Delights', 'Relaxing mushroom gummies for stress relief and calm', 32.00, 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg', 'supplements', 75, true),
    ('Sleep Mushroom Gummy Delights', 'Natural sleep support with premium mushroom extracts', 32.00, 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg', 'supplements', 30, true),
    ('Matcha Chocolate Delights', 'Clean energy and calm focus with premium matcha', 23.00, 'https://images.pexels.com/photos/4021777/pexels-photo-4021777.jpeg', 'supplements', 25, true);
  END IF;
END $$;