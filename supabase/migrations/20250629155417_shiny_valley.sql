/*
  # Add sample products to the database

  1. New Tables
    - Insert sample products into the products table
  2. Security
    - Products are visible to public when active
    - Admins can manage all products
*/

-- Insert sample products if the table is empty
INSERT INTO public.products (name, description, price, image_url, category, stock_quantity, is_active) VALUES
('Focus Mushroom Gummy Delights', 'Premium mushroom gummies with Lion''s Mane and Cordyceps for enhanced focus and mental clarity', 32.00, 'https://images.pexels.com/photos/6207734/pexels-photo-6207734.jpeg', 'supplements', 50, true),
('Chill Mushroom Gummy Delights', 'Relaxing mushroom gummies with Reishi and Ashwagandha for stress relief and better sleep', 32.00, 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg', 'supplements', 75, true),
('Matcha Chocolate Delights', 'Organic matcha chocolate squares for clean energy and calm focus', 23.00, 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg', 'supplements', 30, true),
('In the Zone Capsules', 'Advanced nootropic blend with American Ginseng for peak mental performance', 45.00, 'https://images.pexels.com/photos/4021777/pexels-photo-4021777.jpeg', 'supplements', 25, true),
('Sleep Support Gummies', 'Natural sleep aid with Chamomile, Magnesium, and GABA for restful nights', 28.00, 'https://images.pexels.com/photos/6207738/pexels-photo-6207738.jpeg', 'supplements', 40, true),
('Energy Boost Capsules', 'Natural energy blend with Cordyceps and B-vitamins for sustained vitality', 35.00, 'https://images.pexels.com/photos/4021780/pexels-photo-4021780.jpeg', 'supplements', 60, true)
ON CONFLICT DO NOTHING;