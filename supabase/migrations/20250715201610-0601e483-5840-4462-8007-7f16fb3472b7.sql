-- Add sample reviews for each product
INSERT INTO reviews (product_id, user_id, rating, comment, is_approved, created_at) 
SELECT 
  p.id as product_id,
  (SELECT id FROM users LIMIT 1) as user_id,
  (4 + random())::int as rating, -- Random rating between 4-5
  CASE 
    WHEN random() < 0.2 THEN 'Amazing product! Really helped with my wellness journey. Highly recommend!'
    WHEN random() < 0.4 THEN 'Great quality supplements. I can feel the difference after using them consistently.'
    WHEN random() < 0.6 THEN 'Excellent value for money. Fast shipping and great customer service.'
    WHEN random() < 0.8 THEN 'These supplements have become part of my daily routine. Very satisfied with the results.'
    ELSE 'Outstanding quality and effectiveness. Will definitely purchase again!'
  END as comment,
  true as is_approved,
  NOW() - (random() * interval '9 months') as created_at
FROM products p
CROSS JOIN generate_series(1, 5) gs
WHERE NOT EXISTS (
  SELECT 1 FROM reviews r WHERE r.product_id = p.id
);

-- Insert some sample users for reviews (if needed)
INSERT INTO users (id, email, first_name, last_name, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'gisella.p@example.com', 'Gisella', 'P.', NOW() - interval '1 year'),
  ('22222222-2222-2222-2222-222222222222', 'maria.s@example.com', 'Maria', 'S.', NOW() - interval '1 year'),
  ('33333333-3333-3333-3333-333333333333', 'john.d@example.com', 'John', 'D.', NOW() - interval '1 year'),
  ('44444444-4444-4444-4444-444444444444', 'sarah.k@example.com', 'Sarah', 'K.', NOW() - interval '1 year'),
  ('55555555-5555-5555-5555-555555555555', 'mike.r@example.com', 'Mike', 'R.', NOW() - interval '1 year')
ON CONFLICT (id) DO NOTHING;

-- Update existing reviews to use sample users
WITH sample_users AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM users 
  WHERE id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222', 
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555'
  )
),
review_updates AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
  FROM reviews
)
UPDATE reviews 
SET user_id = sample_users.id
FROM sample_users, review_updates
WHERE reviews.id = review_updates.id 
AND sample_users.rn = ((review_updates.rn - 1) % 5) + 1;