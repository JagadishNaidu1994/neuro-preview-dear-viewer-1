
-- Create user addresses table if not exists (seems to already exist)
-- Create user payment methods table
CREATE TABLE IF NOT EXISTS user_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  card_type text NOT NULL,
  card_last_four text NOT NULL,
  card_holder_name text NOT NULL,
  expiry_month integer NOT NULL,
  expiry_year integer NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  marketing_emails boolean DEFAULT true,
  newsletter_subscription boolean DEFAULT true,
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user security settings table
CREATE TABLE IF NOT EXISTS user_security (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  two_factor_enabled boolean DEFAULT false,
  login_notifications boolean DEFAULT true,
  security_questions jsonb,
  last_password_change timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_payment_methods
CREATE POLICY "Users can manage own payment methods"
  ON user_payment_methods
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for user_preferences
CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create RLS policies for user_security
CREATE POLICY "Users can manage own security settings"
  ON user_security
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Insert sample data for payment methods
INSERT INTO user_payment_methods (user_id, card_type, card_last_four, card_holder_name, expiry_month, expiry_year, is_default)
SELECT 
  auth.uid(),
  'Visa',
  '4532',
  'John Doe',
  12,
  2026,
  true
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO user_payment_methods (user_id, card_type, card_last_four, card_holder_name, expiry_month, expiry_year, is_default)
SELECT 
  auth.uid(),
  'MasterCard',
  '8901',
  'John Doe',
  8,
  2025,
  false
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert sample preferences
INSERT INTO user_preferences (user_id, email_notifications, sms_notifications, marketing_emails, newsletter_subscription, language, timezone)
SELECT 
  auth.uid(),
  true,
  false,
  true,
  true,
  'en',
  'UTC'
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert sample security settings
INSERT INTO user_security (user_id, two_factor_enabled, login_notifications, security_questions)
SELECT 
  auth.uid(),
  false,
  true,
  '{"question1": "What is your favorite color?", "question2": "What was your first pet name?"}'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;
