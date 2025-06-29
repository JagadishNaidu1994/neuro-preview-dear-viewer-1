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
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public users to view active products
    - Add policy for admin users to manage all products

  3. Performance
    - Add indexes on category, is_active, and created_at columns

  4. Sample Data
    - Insert sample products for testing
*/

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

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products (is_active);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products (created_at);

-- Insert some sample products to test the application
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active) VALUES
  (
    'Calm Gummies',
    'Natural stress relief gummies with ashwagandha and L-theanine for daily calm and relaxation.',
    29.99,
    'https://images.pexels.com/photos/5946071/pexels-photo-5946071.jpeg?auto=compress&cs=tinysrgb&w=800',
    'supplements',
    50,
    true
  ),
  (
    'Energy Boost Capsules',
    'Premium energy support with ginseng, B-vitamins, and natural caffeine for sustained vitality.',
    34.99,
    'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=800',
    'supplements',
    75,
    true
  ),
  (
    'Sleep Support Gummies',
    'Melatonin-free sleep aid with chamomile, passionflower, and magnesium for restful nights.',
    27.99,
    'https://images.pexels.com/photos/5946063/pexels-photo-5946063.jpeg?auto=compress&cs=tinysrgb&w=800',
    'supplements',
    40,
    true
  ),
  (
    'Immune Defense Tablets',
    'Comprehensive immune support with vitamin C, zinc, elderberry, and echinacea.',
    24.99,
    'https://images.pexels.com/photos/3683073/pexels-photo-3683073.jpeg?auto=compress&cs=tinysrgb&w=800',
    'supplements',
    60,
    true
  ),
  (
    'Focus & Clarity Capsules',
    'Cognitive enhancement blend with lion''s mane, bacopa monnieri, and rhodiola rosea.',
    39.99,
    'https://images.pexels.com/photos/5946064/pexels-photo-5946064.jpeg?auto=compress&cs=tinysrgb&w=800',
    'supplements',
    30,
    true
  ),
  (
    'Digestive Wellness Gummies',
    'Gut health support with probiotics, digestive enzymes, and prebiotic fiber.',
    32.99,
    'https://images.pexels.com/photos/5946065/pexels-photo-5946065.jpeg?auto=compress&cs=tinysrgb&w=800',
    'supplements',
    45,
    true
  )
ON CONFLICT (id) DO NOTHING;