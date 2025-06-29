/*
  # Consolidate Admin Setup and User Management

  1. Admin Setup
    - Ensure admin_users table exists with proper structure
    - Add current user as admin
    - Set up proper RLS policies

  2. User Management
    - Ensure users table is properly set up
    - Create proper relationships between auth.users and public.users

  3. Products Management
    - Ensure products table has proper admin policies
    - Add sample products if none exist

  4. Security
    - Enable RLS on all tables
    - Create comprehensive policies for admin access
*/

-- First, ensure admin_users table exists
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'admin'::text CHECK (role = ANY (ARRAY['admin'::text, 'super_admin'::text])),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- Create policy for admins to view admin users
CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users admin_users_1 WHERE admin_users_1.user_id = auth.uid()));

-- Ensure users table exists and is properly set up
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Create policies for users table
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure products table exists
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

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Create policies for products table
CREATE POLICY "Anyone can view active products"
  ON public.products
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

-- Function to automatically add current user as admin
CREATE OR REPLACE FUNCTION add_current_user_as_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- If there's a current user, add them as admin
  IF current_user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (user_id, role)
    VALUES (current_user_id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
  END IF;
END;
$$;

-- Add sample products if none exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.products LIMIT 1) THEN
    INSERT INTO public.products (name, description, price, image_url, category, stock_quantity, is_active) VALUES
    ('Focus Mushroom Gummy Delights', 'Premium mushroom gummies with Lion''s Mane and Cordyceps for enhanced focus and mental clarity', 32.00, 'https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg', 'supplements', 50, true),
    ('Chill Mushroom Gummy Delights', 'Relaxing mushroom gummies with Reishi and Ashwagandha for stress relief and better sleep', 32.00, 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg', 'supplements', 75, true),
    ('Matcha Chocolate Delights', 'Organic matcha chocolate squares for clean energy and calm focus', 23.00, 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg', 'supplements', 30, true),
    ('In the Zone Capsules', 'Advanced nootropic blend with American Ginseng for peak mental performance', 45.00, 'https://images.pexels.com/photos/4021777/pexels-photo-4021777.jpeg', 'supplements', 25, true),
    ('Sleep Support Gummies', 'Natural sleep aid with Chamomile, Magnesium, and GABA for restful nights', 28.00, 'https://images.pexels.com/photos/6207738/pexels-photo-6207738.jpeg', 'supplements', 40, true),
    ('Energy Boost Capsules', 'Natural energy blend with Cordyceps and B-vitamins for sustained vitality', 35.00, 'https://images.pexels.com/photos/4021780/pexels-photo-4021780.jpeg', 'supplements', 60, true);
  END IF;
END $$;

-- Create a trigger to automatically sync auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'given_name', NEW.raw_user_meta_data->>'first_name'),
    COALESCE(NEW.raw_user_meta_data->>'family_name', NEW.raw_user_meta_data->>'last_name'),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();