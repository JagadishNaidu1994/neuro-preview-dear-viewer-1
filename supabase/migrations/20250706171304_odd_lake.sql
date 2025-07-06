/*
  # Fix cart relationships and admin users table

  1. Ensure Foreign Key Relationships
    - Verify cart_items to products relationship exists
    - Verify cart_items to auth.users relationship exists
    - Add missing relationships if needed

  2. Ensure Admin Users Table
    - Verify admin_users table exists with proper structure
    - Add proper indexes and constraints

  3. Security
    - Ensure RLS is properly configured
    - Verify all policies are in place
*/

-- Ensure the cart_items table has proper foreign key relationships
-- First, let's make sure the foreign keys exist (using IF NOT EXISTS pattern)

DO $$
BEGIN
  -- Check if foreign key from cart_items to products exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_product_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    ALTER TABLE cart_items 
    ADD CONSTRAINT cart_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;

  -- Check if foreign key from cart_items to auth.users exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_user_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    ALTER TABLE cart_items 
    ADD CONSTRAINT cart_items_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure admin_users table exists with proper structure
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for admin_users if it doesn't exist
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS cart_items_product_id_idx ON cart_items(product_id);

-- Enable RLS on all tables
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Ensure proper RLS policies exist for cart_items
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Ensure proper RLS policies exist for admin_users
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
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

-- Refresh the schema cache to ensure relationships are recognized
NOTIFY pgrst, 'reload schema';