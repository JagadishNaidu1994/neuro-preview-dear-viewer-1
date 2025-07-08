/*
  # Create admin_users table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, references auth.users)
      - `role` (text, default 'admin')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated users to view admin users (only if they are admin themselves)

  3. Constraints
    - Unique constraint on user_id
    - Check constraint on role (admin, super_admin)
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id),
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Add check constraint for role values
ALTER TABLE admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role = ANY (ARRAY['admin'::text, 'super_admin'::text]));

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view admin users
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users admin_users_1
      WHERE admin_users_1.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users(user_id);