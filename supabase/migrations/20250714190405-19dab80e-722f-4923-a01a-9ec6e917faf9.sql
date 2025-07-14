
-- Add foreign key relationship between reviews and users tables
ALTER TABLE reviews 
ADD CONSTRAINT reviews_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Also ensure the foreign key to products table exists
ALTER TABLE reviews 
ADD CONSTRAINT reviews_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
