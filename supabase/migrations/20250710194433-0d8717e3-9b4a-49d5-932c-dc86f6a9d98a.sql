
-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Anyone can read admin status" ON admin_users;

-- Create a simple policy that allows authenticated users to read admin status
-- This avoids the infinite recursion by not checking admin status within the policy
CREATE POLICY "Authenticated users can read admin status" 
  ON admin_users 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create a policy for admins to manage admin users using a security definer function
-- First, create a function that can check admin status without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = user_uuid 
    AND role = 'admin'
  );
$$;

-- Now create a policy for managing admin users
CREATE POLICY "Admins can manage admin users" 
  ON admin_users 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
