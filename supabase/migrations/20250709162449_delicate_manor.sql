/*
  # Fix cart_items and products relationship

  1. Changes
    - Ensure proper foreign key constraint between cart_items and products
    - Update cart_items table structure to match expected schema
    - Add proper indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Ensure users can only access their own cart items
*/

-- Ensure the foreign key constraint exists between cart_items and products
DO $$
BEGIN
  -- Check if the foreign key constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_product_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE cart_items 
    ADD CONSTRAINT cart_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS cart_items_product_id_idx ON cart_items(product_id);

-- Create unique constraint to prevent duplicate cart items for same user/product
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_user_id_product_id_key' 
    AND table_name = 'cart_items'
  ) THEN
    ALTER TABLE cart_items 
    ADD CONSTRAINT cart_items_user_id_product_id_key 
    UNIQUE (user_id, product_id);
  END IF;
END $$;