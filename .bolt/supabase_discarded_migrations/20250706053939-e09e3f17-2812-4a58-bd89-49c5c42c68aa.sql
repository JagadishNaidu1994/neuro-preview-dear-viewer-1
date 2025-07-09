
-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active) VALUES
('Chill Mushroom Gummy Delights', 'For Happy Calm & Less Stress. Premium blend of reishi and ashwagandha for relaxation.', 32.00, 'https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg?auto=compress&cs=tinysrgb&w=800', 'gummies', 50, true),
('Focus Mushroom Gummy Delights', 'For Mental Clarity & Sharp Focus. Lions mane and cordyceps for cognitive enhancement.', 32.00, 'https://images.pexels.com/photos/5946071/pexels-photo-5946071.jpeg?auto=compress&cs=tinysrgb&w=800', 'gummies', 45, true),
('Sleep Mushroom Gummy Delights', 'For Deep Sleep & Recovery. Reishi and passionflower for restful nights.', 32.00, 'https://images.pexels.com/photos/5946063/pexels-photo-5946063.jpeg?auto=compress&cs=tinysrgb&w=800', 'gummies', 60, true),
('Matcha Chocolate Delights', 'For Clean Energy, Calm Focus & Good Mood. Premium ceremonial grade matcha.', 23.00, 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=800', 'chocolate', 40, true),
('Energy Boost Complex', 'Natural energy blend with cordyceps and B-vitamins for sustained vitality.', 28.00, 'https://images.pexels.com/photos/7262810/pexels-photo-7262810.jpeg?auto=compress&cs=tinysrgb&w=800', 'supplements', 35, true),
('Stress Relief Blend', 'Adaptogenic herbs including ashwagandha and rhodiola for stress management.', 35.00, 'https://images.pexels.com/photos/6205509/pexels-photo-6205509.jpeg?auto=compress&cs=tinysrgb&w=800', 'supplements', 30, true);

-- Create a test user for admin (this would normally be done through auth signup)
-- Note: In production, the admin user should sign up normally first
INSERT INTO users (id, email, first_name, last_name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'dearneuro2025@gmail.com', 'Admin', 'User')
ON CONFLICT (id) DO NOTHING;

-- Make the specific email an admin
INSERT INTO admin_users (user_id, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- Insert sample orders for dashboard
INSERT INTO orders (id, user_id, total_amount, status, shipping_address, created_at) VALUES
('11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 260.00, 'pending', '{"street": "123 Main St", "city": "London", "postal_code": "SW1A 1AA", "country": "UK"}', '2025-07-05 10:30:00'::timestamp),
('22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440000', 25.00, 'pending', '{"street": "456 Oak Ave", "city": "Manchester", "postal_code": "M1 1AA", "country": "UK"}', '2025-07-05 09:15:00'::timestamp),
('33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440000', 100.00, 'pending', '{"street": "789 Pine Rd", "city": "Birmingham", "postal_code": "B1 1AA", "country": "UK"}', '2025-07-04 14:45:00'::timestamp);

-- Insert order items for the sample orders
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM products WHERE name = 'Chill Mushroom Gummy Delights' LIMIT 1), 2, 32.00),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM products WHERE name = 'Focus Mushroom Gummy Delights' LIMIT 1), 3, 32.00),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM products WHERE name = 'Sleep Mushroom Gummy Delights' LIMIT 1), 4, 32.00),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM products WHERE name = 'Matcha Chocolate Delights' LIMIT 1), 1, 23.00),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM products WHERE name = 'Energy Boost Complex' LIMIT 1), 2, 28.00),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM products WHERE name = 'Stress Relief Blend' LIMIT 1), 1, 35.00);

-- Create customer addresses table for admin dashboard
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100),
  street_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on customer_addresses
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for customer_addresses
CREATE POLICY "Users can manage own addresses" ON customer_addresses
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all addresses" ON customer_addresses
FOR SELECT USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Insert sample addresses
INSERT INTO customer_addresses (user_id, title, street_address, city, postal_code, country, is_default) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Home', '123 Main Street', 'London', 'SW1A 1AA', 'United Kingdom', true),
('550e8400-e29b-41d4-a716-446655440000', 'Office', '456 Business Park', 'Manchester', 'M1 2AB', 'United Kingdom', false);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  frequency VARCHAR(50) NOT NULL, -- monthly, quarterly, etc
  next_delivery_date DATE,
  quantity INTEGER DEFAULT 1,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Users can manage own subscriptions" ON subscriptions
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON subscriptions
FOR SELECT USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Insert sample subscriptions
INSERT INTO subscriptions (user_id, product_id, status, frequency, next_delivery_date, quantity, discount_percentage) VALUES
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM products WHERE name = 'Chill Mushroom Gummy Delights' LIMIT 1), 'active', 'monthly', '2025-08-05', 1, 10.00),
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM products WHERE name = 'Focus Mushroom Gummy Delights' LIMIT 1), 'active', 'monthly', '2025-08-10', 2, 15.00);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- card, paypal, etc
  last_four VARCHAR(4),
  brand VARCHAR(50), -- visa, mastercard, etc
  expires_month INTEGER,
  expires_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on payment_methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_methods
CREATE POLICY "Users can manage own payment methods" ON payment_methods
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view payment methods" ON payment_methods
FOR SELECT USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Insert sample payment methods
INSERT INTO payment_methods (user_id, type, last_four, brand, expires_month, expires_year, is_default) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'card', '4242', 'Visa', 12, 2028, true),
('550e8400-e29b-41d4-a716-446655440000', 'card', '5555', 'Mastercard', 6, 2027, false);
