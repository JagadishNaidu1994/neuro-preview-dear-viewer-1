/*
  # Fix infinite recursion in admin_users RLS policy

  1. Problem
    - The "Admins can manage admin users" policy uses FOR ALL and references admin_users table within itself
    - This creates infinite recursion when the policy tries to evaluate itself

  2. Solution
    - Remove the problematic FOR ALL policy
    - Replace with separate granular policies for INSERT, UPDATE, DELETE
    - Keep the SELECT policy simple to avoid recursion
    - Use super_admin role for management operations to prevent regular admins from managing other admins

  3. Security
    - Maintain read access for authenticated users to check admin status
    - Restrict management operations to super_admin role only
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- Create separate policies for different operations to avoid recursion

-- Policy for INSERT operations - only super_admins can add new admin users
CREATE POLICY "Super admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Policy for UPDATE operations - only super_admins can update admin users
CREATE POLICY "Super admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Policy for DELETE operations - only super_admins can delete admin users
CREATE POLICY "Super admins can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- The SELECT policy "Anyone can read admin status" should remain as is
-- It allows the useAdmin hook to check admin status without recursion