-- Insert sample reviews using existing users or create a default sample approach
DO $$
DECLARE
    existing_user_id UUID;
    sample_user_id UUID;
    product_record RECORD;
BEGIN
    -- Get first existing user or create a sample one
    SELECT id INTO existing_user_id FROM users LIMIT 1;
    
    IF existing_user_id IS NULL THEN
        -- If no users exist, create a sample user
        sample_user_id := gen_random_uuid();
        INSERT INTO users (id, email, first_name, last_name, created_at)
        VALUES (sample_user_id, 'sample@example.com', 'Sample', 'User', NOW() - interval '1 year');
        existing_user_id := sample_user_id;
    END IF;

    -- Insert 5 reviews for each product
    FOR product_record IN SELECT id FROM products LOOP
        FOR i IN 1..5 LOOP
            INSERT INTO reviews (product_id, user_id, rating, comment, is_approved, created_at) 
            VALUES (
                product_record.id,
                existing_user_id,
                (4 + random())::int, -- Random rating between 4-5
                CASE 
                    WHEN i = 1 THEN 'Amazing product! Really helped with my wellness journey. Highly recommend!'
                    WHEN i = 2 THEN 'Great quality supplements. I can feel the difference after using them consistently.'
                    WHEN i = 3 THEN 'Excellent value for money. Fast shipping and great customer service.'
                    WHEN i = 4 THEN 'These supplements have become part of my daily routine. Very satisfied with the results.'
                    ELSE 'Outstanding quality and effectiveness. Will definitely purchase again!'
                END,
                true,
                NOW() - (random() * interval '9 months')
            );
        END LOOP;
    END LOOP;
END $$;