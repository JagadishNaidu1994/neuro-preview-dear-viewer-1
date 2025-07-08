/*
  # Fix cart items and admin relationships

  1. Database Issues Fixed
    - Ensure cart_items has proper foreign key to products table
    - Verify admin_users table exists with proper structure
    - Add any missing constraints and indexes

  2. Security
    - Maintain existing RLS policies
    - Ensure proper foreign key constraints for data integrity
*/

-- First, let's ensure the cart_items table has the correct foreign key constraint
-- Drop the existing constraint if it exists and recreate it properly
DO $$
BEGIN
  -- Check if the foreign key constraint exists and drop it if it does
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_product_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    ALTER TABLE cart_items DROP CONSTRAINT cart_items_product_id_fkey;
  END IF;
END $$;

-- Add the foreign key constraint properly
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Ensure admin_users table exists with proper structure
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for admin_users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'admin_users_user_id_fkey' 
    AND table_name = 'admin_users'
  ) THEN
    ALTER TABLE admin_users 
    ADD CONSTRAINT admin_users_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for admin_users if they don't exist
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users(user_id);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
  
  -- Create the policy
  CREATE POLICY "Admins can view admin users"
    ON admin_users
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users admin_users_1
        WHERE admin_users_1.user_id = auth.uid()
      )
    );
END $$;

-- Verify cart_items foreign key constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_product_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    RAISE EXCEPTION 'cart_items foreign key constraint was not created properly';
  END IF;
END $$;