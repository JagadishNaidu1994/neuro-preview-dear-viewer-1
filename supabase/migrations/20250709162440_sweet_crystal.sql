/*
  # Fix admin_users table structure

  1. Changes
    - Ensure admin_users table exists with correct structure
    - Add proper foreign key constraint to auth.users
    - Update RLS policies for proper access control
    - Add function to make current user admin

  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin management
    - Add policy for reading admin status
*/

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Anyone can read admin status" ON admin_users;

-- Create RLS policies
CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users admin_users_1
      WHERE admin_users_1.user_id = auth.uid() 
      AND admin_users_1.role = 'admin'
    )
  );

CREATE POLICY "Anyone can read admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users(user_id);

-- Create function to add current user as admin
CREATE OR REPLACE FUNCTION add_current_user_as_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_users (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;