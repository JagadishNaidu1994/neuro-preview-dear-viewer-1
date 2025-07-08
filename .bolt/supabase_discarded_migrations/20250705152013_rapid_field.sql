/*
  # Complete Database Schema Setup

  1. New Tables
    - `users` - User profiles extending auth.users
    - `admin_users` - Admin user management
    - `products` - Product catalog
    - `cart_items` - Shopping cart functionality
    - `orders` - Customer orders
    - `order_items` - Individual items in orders
    - `referrals` - Referral system
    - `user_rewards` - Points and rewards tracking

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
    - Separate admin and user permissions

  3. Sample Data
    - Insert sample products for testing
*/

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id),
  role text DEFAULT 'admin' CHECK (role = ANY (ARRAY['admin'::text, 'super_admin'::text])),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users admin_users_1
    WHERE admin_users_1.user_id = auth.uid()
  ));

-- Create products table
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

CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Create indexes for products
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products(is_active);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for cart_items
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS cart_items_user_id_product_id_key ON cart_items(user_id, product_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  shipping_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

CREATE POLICY "Admins can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer DEFAULT 1 NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id),
  referee_id uuid REFERENCES auth.users(id),
  referral_code text NOT NULL,
  status text DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text])),
  reward_points integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "Users can create referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (referrer_id = auth.uid());

-- Create user_rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  points_balance integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  total_redeemed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON user_rewards
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own rewards"
  ON user_rewards
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can manage rewards"
  ON user_rewards
  FOR ALL
  TO authenticated
  USING (true);

-- Create trigger function for new user handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'given_name',
    NEW.raw_user_meta_data->>'family_name'
  );
  
  INSERT INTO user_rewards (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert some sample products if none exist
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 
  'Focus Mushroom Gummy Delights',
  'Premium mushroom gummies with Lion''s Mane and Cordyceps for enhanced focus and mental clarity',
  32.00,
  'https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg',
  'supplements',
  50,
  true
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 
  'Chill Mushroom Gummy Delights',
  'Relaxing mushroom gummies with Reishi and Ashwagandha for stress relief and better sleep',
  32.00,
  'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg',
  'supplements',
  75,
  true
WHERE (SELECT COUNT(*) FROM products) < 2;

INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 
  'Matcha Chocolate Delights',
  'Organic matcha chocolate squares for clean energy and calm focus',
  23.00,
  'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg',
  'supplements',
  30,
  true
WHERE (SELECT COUNT(*) FROM products) < 3;

INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 
  'Sleep Support Gummies',
  'Natural sleep aid with Chamomile, Magnesium, and GABA for restful nights',
  28.00,
  'https://images.pexels.com/photos/6207738/pexels-photo-6207738.jpeg',
  'supplements',
  40,
  true
WHERE (SELECT COUNT(*) FROM products) < 4;

INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 
  'Energy Boost Capsules',
  'Natural energy blend with Cordyceps and B-vitamins for sustained vitality',
  35.00,
  'https://images.pexels.com/photos/4021780/pexels-photo-4021780.jpeg',
  'supplements',
  60,
  true
WHERE (SELECT COUNT(*) FROM products) < 5;

INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 
  'Brain Boost Powder',
  'Nootropic powder blend with Lion''s Mane and Rhodiola for enhanced cognitive performance',
  42.00,
  'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg',
  'supplements',
  25,
  true
WHERE (SELECT COUNT(*) FROM products) < 6;