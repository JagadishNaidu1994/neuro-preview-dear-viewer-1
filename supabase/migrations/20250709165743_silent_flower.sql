/*
  # Fix cart items and admin users relationships

  1. Foreign Key Fixes
    - Add missing foreign key constraint between cart_items and products
    - Ensure admin_users foreign key is properly configured
  
  2. Table Updates
    - Update cart_items table to ensure proper product relationship
    - Verify admin_users table structure
  
  3. Security
    - Maintain existing RLS policies
    - Ensure proper access controls
*/

-- First, let's ensure the products table exists and has the right structure
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  category text DEFAULT 'supplements',
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on products if not already enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for products if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Anyone can view active products'
  ) THEN
    CREATE POLICY "Anyone can view active products"
      ON products
      FOR SELECT
      TO public
      USING (is_active = true);
  END IF;
END $$;

-- Now ensure cart_items table has proper structure and foreign key
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid,
  quantity integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Drop existing foreign key if it exists and recreate it properly
DO $$
BEGIN
  -- Drop the constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_product_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    ALTER TABLE cart_items DROP CONSTRAINT cart_items_product_id_fkey;
  END IF;
  
  -- Add the foreign key constraint
  ALTER TABLE cart_items 
  ADD CONSTRAINT cart_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
END $$;

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create cart_items policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cart_items' AND policyname = 'Users can manage own cart'
  ) THEN
    CREATE POLICY "Users can manage own cart"
      ON cart_items
      FOR ALL
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Ensure admin_users table exists with proper structure
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create admin_users policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_users' AND policyname = 'Anyone can read admin status'
  ) THEN
    CREATE POLICY "Anyone can read admin status"
      ON admin_users
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_users' AND policyname = 'Admins can manage admin users'
  ) THEN
    CREATE POLICY "Admins can manage admin users"
      ON admin_users
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users au 
          WHERE au.user_id = auth.uid() AND au.role = 'admin'
        )
      );
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS cart_items_product_id_idx ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products(is_active);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);