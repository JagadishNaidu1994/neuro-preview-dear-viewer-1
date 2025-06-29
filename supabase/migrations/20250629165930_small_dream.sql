/*
  # Consolidate all data into one project

  1. Ensure all tables exist in main project
    - products (with sample data)
    - admin_users (for admin access)
    - users (for user profiles)
    - All other e-commerce tables

  2. Set up proper admin access
    - Create function to add current user as admin
    - Set up all RLS policies correctly

  3. Create all missing e-commerce tables
    - orders, order_items, cart_items, etc.
*/

-- Ensure admin_users table exists
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'admin'::text CHECK (role = ANY (ARRAY['admin'::text, 'super_admin'::text])),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view admin users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_users' 
    AND policyname = 'Admins can view admin users'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Admins can view admin users"
      ON public.admin_users
      FOR SELECT
      TO authenticated
      USING (EXISTS (SELECT 1 FROM public.admin_users admin_users_1 WHERE admin_users_1.user_id = auth.uid()));
  END IF;
END $$;

-- Ensure users table exists
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can view own profile'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can update own profile'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can insert own profile'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON public.users
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  shipping_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders USING btree (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders USING btree (status);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Users can view own orders'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Users can view own orders"
      ON public.orders
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Users can create own orders'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Users can create own orders"
      ON public.orders
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Admins can view all orders'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Admins can view all orders"
      ON public.orders
      FOR SELECT
      TO authenticated
      USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Admins can update orders'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Admins can update orders"
      ON public.orders
      FOR UPDATE
      TO authenticated
      USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));
  END IF;
END $$;

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for order_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' 
    AND policyname = 'Users can view own order items'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Users can view own order items"
      ON public.order_items
      FOR SELECT
      TO authenticated
      USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' 
    AND policyname = 'Users can create order items'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Users can create order items"
      ON public.order_items
      FOR INSERT
      TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' 
    AND policyname = 'Admins can view all order items'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Admins can view all order items"
      ON public.order_items
      FOR SELECT
      TO authenticated
      USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));
  END IF;
END $$;

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create index for cart_items
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON public.cart_items USING btree (user_id);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policy for cart_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cart_items' 
    AND policyname = 'Users can manage own cart'
    AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Users can manage own cart"
      ON public.cart_items
      FOR ALL
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Function to automatically add current user as admin
CREATE OR REPLACE FUNCTION add_current_user_as_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- If there's a current user, add them as admin
  IF current_user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (user_id, role)
    VALUES (current_user_id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
    
    RAISE NOTICE 'User % has been added as super admin', current_user_id;
  ELSE
    RAISE NOTICE 'No authenticated user found';
  END IF;
END;
$$;

-- Create a trigger to automatically sync auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'given_name', NEW.raw_user_meta_data->>'first_name'),
    COALESCE(NEW.raw_user_meta_data->>'family_name', NEW.raw_user_meta_data->>'last_name'),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();