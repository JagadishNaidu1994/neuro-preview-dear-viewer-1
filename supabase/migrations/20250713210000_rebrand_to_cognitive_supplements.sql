-- Add benefits column to products table
ALTER TABLE products
ADD COLUMN benefits TEXT[];

-- Update existing products to reflect the new brand identity
UPDATE products
SET
  name = 'Cognitive Support Supplement',
  description = 'A daily supplement to support brain health, focus, and memory.',
  image_url = 'https://images.unsplash.com/photo-1593095499889-72b1dc4638d3',
  category = 'Cognitive Support',
  benefits = '{"Supports memory and focus", "Promotes brain health", "Enhances mental clarity"}'
WHERE id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

UPDATE products
SET
  name = 'Sleep Support Supplement',
  description = 'A natural supplement to promote restful sleep and relaxation.',
  image_url = 'https://images.unsplash.com/photo-1593095499889-72b1dc4638d3',
  category = 'Sleep Support',
  benefits = '{"Promotes restful sleep", "Supports relaxation", "Calms the mind"}'
WHERE id = 'b2c3d4e5-f6a1-b2c3-d4e5-f6a1b2c3d4e5';

UPDATE products
SET
  name = 'Anxiety Relief Supplement',
  description = 'A natural supplement to reduce stress and anxiety.',
  image_url = 'https://images.unsplash.com/photo-1593095499889-72b1dc4638d3',
  category = 'Anxiety Relief',
  benefits = '{"Reduces stress and anxiety", "Promotes a sense of calm", "Supports emotional well-being"}'
WHERE id = 'c3d4e5f6-a1b2-c3d4-e5f6-a1b2c3d4e5f6';
