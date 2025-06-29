/*
  # Create admin users table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (text, admin role type)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for admins to view admin users
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  role text DEFAULT 'admin'::text,
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint on user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'admin_users_user_id_key' 
    AND table_name = 'admin_users'
  ) THEN
    ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Add check constraint for role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'admin_users_role_check' 
    AND table_name = 'admin_users'
  ) THEN
    ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_role_check CHECK (role = ANY (ARRAY['admin'::text, 'super_admin'::text]));
  END IF;
END $$;

-- Enable Row Level Security
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