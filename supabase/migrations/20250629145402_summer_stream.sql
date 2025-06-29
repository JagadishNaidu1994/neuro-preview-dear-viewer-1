/*
  # Add Sample Products for Testing

  1. Sample Products
    - Focus Mushroom Gummy Delights
    - Chill Mushroom Gummy Delights  
    - Sleep Mushroom Gummy Delights
    - Matcha Chocolate Delights
    - Energy Boost Capsules
    - Stress Relief Tincture

  2. Additional sample data for testing cart functionality
*/

-- Insert additional sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Energy Boost Capsules', 'Natural energy enhancement with B-vitamins and adaptogens for sustained vitality throughout the day', 28.00, 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg', 'capsules', 75),
('Stress Relief Tincture', 'Fast-acting liquid formula with ashwagandha and passionflower for immediate calm and relaxation', 35.00, 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg', 'tinctures', 50),
('Brain Boost Powder', 'Nootropic powder blend with lion''s mane and rhodiola for enhanced cognitive performance', 42.00, 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg', 'powders', 60),
('Immunity Support Gummies', 'Delicious gummies with elderberry, zinc, and vitamin C for immune system support', 26.00, 'https://images.pexels.com/photos/5938567/pexels-photo-5938567.jpeg', 'gummies', 120),
('Deep Sleep Formula', 'Advanced sleep support with melatonin, magnesium, and calming herbs for restful nights', 38.00, 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg', 'capsules', 85),
('Mood Balance Blend', 'Herbal blend with St. John''s wort and 5-HTP to support emotional well-being and mood stability', 33.00, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'capsules', 90);

-- Create referral system tables
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id),
  referee_id uuid REFERENCES auth.users(id),
  referral_code text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  reward_points integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create rewards/points table
CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  points_balance integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  total_redeemed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- Referrals policies
CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (referrer_id = auth.uid());

-- User rewards policies
CREATE POLICY "Users can view own rewards"
  ON user_rewards FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own rewards"
  ON user_rewards FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can manage rewards"
  ON user_rewards FOR ALL
  TO authenticated
  USING (true);