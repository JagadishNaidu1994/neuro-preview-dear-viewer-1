
-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active) VALUES
('Ashwagandha Capsules', 'Premium quality Ashwagandha extract for stress relief and energy boost. 60 capsules per bottle.', 899.00, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', 'supplements', 50, true),
('Turmeric Curcumin', 'High potency turmeric with black pepper extract for better absorption. Anti-inflammatory support.', 1299.00, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500', 'supplements', 75, true),
('Brahmi Tablets', 'Natural cognitive enhancer for memory and focus. Made from pure Brahmi extract.', 699.00, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500', 'supplements', 30, true),
('Triphala Powder', 'Traditional Ayurvedic digestive support blend. 100g pure organic powder.', 449.00, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500', 'supplements', 60, true),
('Giloy Immunity Booster', 'Natural immunity booster made from fresh Giloy stems. 500mg capsules.', 799.00, 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500', 'supplements', 40, true),
('Moringa Leaf Powder', 'Nutrient-rich superfood powder. 200g organic Moringa leaves.', 549.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 'supplements', 45, true);

-- Insert sample shipping methods for India
INSERT INTO shipping_methods (name, description, price, estimated_days, is_active) VALUES
('Standard Delivery', 'Regular delivery across India. Free for orders above ₹999', 50.00, '5-7 business days', true),
('Express Delivery', 'Faster delivery to major cities', 150.00, '2-3 business days', true),
('Same Day Delivery', 'Available in select metro cities only', 250.00, 'Same day delivery', true),
('Cash on Delivery', 'Pay when you receive. Available in most locations', 75.00, '5-7 business days', true);

-- Insert sample addresses for users (you'll need to update user_id with actual user IDs)
-- Note: These are sample addresses, user_id should be replaced with actual authenticated user IDs
INSERT INTO user_addresses (user_id, name, phone, address_line_1, address_line_2, city, state, pincode, is_default) VALUES
('00000000-0000-0000-0000-000000000000', 'John Doe', '+91 9876543210', 'Flat 301, Sunrise Apartments', 'Road No. 12, Banjara Hills', 'Hyderabad', 'Telangana', '500034', true),
('00000000-0000-0000-0000-000000000000', 'Jane Smith', '+91 9876543211', 'Plot No. 45, Gachibowli', 'Near HITEC City', 'Hyderabad', 'Telangana', '500032', false);
