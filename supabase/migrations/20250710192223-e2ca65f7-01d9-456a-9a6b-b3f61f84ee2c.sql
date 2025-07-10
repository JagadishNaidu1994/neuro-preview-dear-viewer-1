
-- Create journals table
CREATE TABLE IF NOT EXISTS journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  author text DEFAULT 'DearNeuro Team',
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

-- Create coupon_codes table
CREATE TABLE IF NOT EXISTS coupon_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL,
  minimum_order_amount numeric DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for journals
CREATE POLICY "Anyone can view published journals" 
  ON journals FOR SELECT 
  TO public 
  USING (published = true);

CREATE POLICY "Admins can manage journals" 
  ON journals FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- RLS Policies for contact_submissions
CREATE POLICY "Admins can view contact submissions" 
  ON contact_submissions FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can create contact submissions" 
  ON contact_submissions FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Admins can update contact submissions" 
  ON contact_submissions FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- RLS Policies for coupon_codes
CREATE POLICY "Anyone can view active coupons" 
  ON coupon_codes FOR SELECT 
  TO public 
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage coupon codes" 
  ON coupon_codes FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Update products table to allow admin management
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Update shipping_methods to allow admin management
DROP POLICY IF EXISTS "Admins can manage shipping methods" ON shipping_methods;
CREATE POLICY "Admins can manage shipping methods"
  ON shipping_methods FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ));

-- Insert some sample data for testing
INSERT INTO journals (title, content, excerpt, image_url, published) VALUES
('The Science Behind Mushroom Wellness', 'Functional mushrooms have been used for centuries in traditional medicine...', 'Discover the scientific research behind functional mushrooms and their cognitive benefits.', 'https://images.pexels.com/photos/5946071/pexels-photo-5946071.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Understanding Adaptogenic Benefits', 'Adaptogens are natural substances that help the body adapt to stress...', 'Learn how adaptogens work to support your mental and physical well-being.', 'https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Daily Wellness Rituals', 'Creating sustainable wellness routines is key to long-term cognitive health...', 'Simple daily practices that can transform your mental clarity and focus.', 'https://images.pexels.com/photos/5946063/pexels-photo-5946063.jpeg?auto=compress&cs=tinysrgb&w=800', false);

INSERT INTO coupon_codes (code, discount_type, discount_value, minimum_order_amount, max_uses, expires_at) VALUES
('WELCOME10', 'percentage', 10, 25, 100, now() + interval '30 days'),
('SAVE20', 'fixed', 20, 50, 50, now() + interval '15 days'),
('NEWUSER', 'percentage', 15, 30, 200, now() + interval '60 days');

INSERT INTO contact_submissions (name, email, subject, message) VALUES
('John Doe', 'john@example.com', 'Product Inquiry', 'I would like to know more about your Focus gummies and their ingredients.'),
('Sarah Smith', 'sarah@example.com', 'Shipping Question', 'What are your shipping options for international orders?'),
('Mike Johnson', 'mike@example.com', 'General Feedback', 'Great products! The Sleep gummies have really helped improve my sleep quality.');

-- Add some sample products if the table is empty
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 'Chill Mushroom Gummies', 'Premium functional mushroom gummies for calm and stress relief', 32.00, 'https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg?auto=compress&cs=tinysrgb&w=800', 'gummies', 50, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chill Mushroom Gummies');

INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 'Focus Mushroom Gummies', 'Enhance mental clarity and cognitive function', 32.00, 'https://images.pexels.com/photos/5946071/pexels-photo-5946071.jpeg?auto=compress&cs=tinysrgb&w=800', 'gummies', 45, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Focus Mushroom Gummies');

INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active)
SELECT 'Sleep Mushroom Gummies', 'Support deep sleep and recovery', 32.00, 'https://images.pexels.com/photos/5946063/pexels-photo-5946063.jpeg?auto=compress&cs=tinysrgb&w=800', 'gummies', 40, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sleep Mushroom Gummies');

-- Add some sample orders if none exist
INSERT INTO orders (user_id, total_amount, status, shipping_address)
SELECT gen_random_uuid(), 64.00, 'pending', '{"name": "Sample User", "address": "123 Main St", "city": "New York", "state": "NY", "zip": "10001"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM orders);

INSERT INTO orders (user_id, total_amount, status, shipping_address)
SELECT gen_random_uuid(), 32.00, 'processing', '{"name": "Test Customer", "address": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE total_amount = 32.00);
