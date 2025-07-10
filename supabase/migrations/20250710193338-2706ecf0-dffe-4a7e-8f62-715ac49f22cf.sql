
-- Insert the specific email as an admin user
-- First, we need to get the user_id for the email from auth.users
-- Since we can't directly query auth.users, we'll create a function to handle this

-- Create a function to add admin by email
CREATE OR REPLACE FUNCTION add_admin_by_email(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Get the user_id from the users table (which syncs with auth.users)
    SELECT id INTO user_uuid 
    FROM users 
    WHERE email = admin_email;
    
    IF user_uuid IS NOT NULL THEN
        -- Insert into admin_users table
        INSERT INTO admin_users (user_id, role)
        VALUES (user_uuid, 'admin')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END;
$$;

-- Call the function to add the specific email as admin
SELECT add_admin_by_email('dearneuro2025@gmail.com');
