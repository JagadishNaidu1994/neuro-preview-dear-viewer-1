
-- Update existing products to brain and cognitive support supplements
UPDATE products SET
  name = 'Lion''s Mane Focus Capsules',
  description = 'Premium Lion''s Mane mushroom extract for enhanced cognitive function and mental clarity. 60 capsules per bottle.',
  image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
  category = 'cognitive-support'
WHERE name LIKE '%Ashwagandha%';

UPDATE products SET
  name = 'Bacopa Memory Booster',
  description = 'High-potency Bacopa Monnieri extract for memory enhancement and cognitive performance. 90 capsules per bottle.',
  image_url = 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500',
  category = 'memory-support'
WHERE name LIKE '%Turmeric%';

UPDATE products SET
  name = 'Rhodiola Stress & Focus',
  description = 'Adaptogenic Rhodiola extract for stress management and mental focus. Supports cognitive resilience.',
  image_url = 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500',
  category = 'stress-support'
WHERE name LIKE '%Brahmi%';

UPDATE products SET
  name = 'Ginkgo Brain Blend',
  description = 'Traditional Ginkgo Biloba extract for improved blood flow to the brain and cognitive support. 120 tablets.',
  image_url = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500',
  category = 'brain-health'
WHERE name LIKE '%Triphala%';

UPDATE products SET
  name = 'Phosphatidylserine Mind Complex',
  description = 'Advanced phospholipid formula for brain cell membrane health and cognitive function. 60 softgels.',
  image_url = 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500',
  category = 'brain-health'
WHERE name LIKE '%Giloy%';

UPDATE products SET
  name = 'Omega-3 Brain Support',
  description = 'High-DHA fish oil for brain health, memory, and cognitive development. 120 softgels.',
  image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
  category = 'brain-health'
WHERE name LIKE '%Moringa%';

-- Insert additional brain and cognitive support products
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active) VALUES
('NeuroVitality Complete', 'Comprehensive nootropic blend with B-vitamins, choline, and herbal extracts for all-day mental energy.', 2499.00, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', 'nootropics', 45, true),
('CogniSharp Focus Formula', 'Precision-crafted blend of Alpha-GPC, L-Theanine, and Ginseng for razor-sharp focus and concentration.', 1899.00, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500', 'focus', 60, true),
('MemoryMax Pro', 'Advanced memory support with Huperzine A, Vinpocetine, and traditional brain herbs.', 2299.00, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500', 'memory-support', 35, true),
('BrainShield Antioxidant', 'Neuroprotective formula with Curcumin, Resveratrol, and brain-specific antioxidants.', 1799.00, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500', 'neuroprotection', 50, true);

-- Update shipping methods descriptions for brain supplement context
UPDATE shipping_methods SET
  description = 'Standard delivery for brain supplements across India. Free for orders above ₹999'
WHERE name = 'Standard Delivery';

-- Update journal entries to brain health topics
UPDATE journals SET
  title = 'The Science Behind Lion''s Mane for Cognitive Enhancement',
  content = 'Lion''s Mane mushroom has been extensively studied for its neurotropic properties. Research shows that compounds called hericenones and erinacines can stimulate nerve growth factor (NGF) production, potentially supporting brain health and cognitive function. Studies suggest regular consumption may help with memory, focus, and overall mental clarity.',
  excerpt = 'Discover how Lion''s Mane mushroom supports brain health through nerve growth factor stimulation and cognitive enhancement.',
  author = 'NeuroWellness Team'
WHERE title LIKE '%Ashwagandha%' OR title LIKE '%matcha%' OR title LIKE '%Matcha%';

INSERT INTO journals (title, content, excerpt, author, published, image_url) VALUES
('Understanding Nootropics: Your Guide to Cognitive Enhancement', 'Nootropics, often called "smart drugs" or cognitive enhancers, are substances that may improve cognitive function, particularly executive functions, memory, creativity, or motivation. Natural nootropics include herbs like Bacopa Monnieri, Ginkgo Biloba, and Rhodiola Rosea, which have been used for centuries to support mental performance.', 'A comprehensive guide to natural nootropics and how they support cognitive function and mental performance.', 'NeuroWellness Team', true, 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500'),
('Memory and Focus: The Role of Omega-3 in Brain Health', 'DHA and EPA, the primary omega-3 fatty acids found in fish oil, are crucial for brain health. DHA makes up about 40% of the polyunsaturated fatty acids in the brain and is essential for cognitive development and function. Regular supplementation has been linked to improved memory, focus, and overall brain health.', 'Learn how Omega-3 fatty acids support memory, focus, and long-term brain health through scientific research.', 'NeuroWellness Team', true, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500');
