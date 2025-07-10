
-- Create journals table
CREATE TABLE IF NOT EXISTS public.journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  author text DEFAULT 'DearNeuro Team',
  image_url text,
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'unread',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create coupon_codes table
CREATE TABLE IF NOT EXISTS public.coupon_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL,
  minimum_order_amount numeric DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for journals
CREATE POLICY "Anyone can read published journals" ON public.journals
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage journals" ON public.journals
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create RLS policies for contact_submissions
CREATE POLICY "Anyone can create contact submissions" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for coupon_codes
CREATE POLICY "Anyone can read active coupons" ON public.coupon_codes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage coupons" ON public.coupon_codes
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create RLS policies for products (allow admins to manage)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create RLS policies for shipping_methods (allow admins to manage)
DROP POLICY IF EXISTS "Anyone can view shipping methods" ON public.shipping_methods;

CREATE POLICY "Anyone can view shipping methods" ON public.shipping_methods
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage shipping methods" ON public.shipping_methods
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create RLS policies for orders (allow admins to manage)
CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
