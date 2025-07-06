/*
  # Fix cart items and products relationship

  1. Database Fixes
    - Ensure foreign key relationship between cart_items and products exists
    - Refresh schema cache by recreating the constraint if needed
    - Verify admin_users table structure

  2. Security
    - Maintain existing RLS policies
    - Ensure proper constraints are in place
*/

-- First, let's ensure the foreign key constraint exists for cart_items -> products
-- Drop the constraint if it exists and recreate it to refresh the schema cache
DO $$
BEGIN
  -- Check if the foreign key constraint exists and drop it
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_product_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    ALTER TABLE cart_items DROP CONSTRAINT cart_items_product_id_fkey;
  END IF;
END $$;

-- Recreate the foreign key constraint
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Ensure admin_users table exists with proper structure
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id),
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users if not already enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Recreate admin_users policies to ensure they exist
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS cart_items_product_id_idx ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users(user_id);

-- Refresh the schema cache by updating table comments
COMMENT ON TABLE cart_items IS 'Shopping cart items for users';
COMMENT ON TABLE products IS 'Product catalog';
COMMENT ON TABLE admin_users IS 'Administrative users with elevated permissions';