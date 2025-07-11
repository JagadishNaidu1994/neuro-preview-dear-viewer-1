
-- Clear all existing sample data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM user_addresses;
DELETE FROM user_payment_methods;
DELETE FROM user_rewards;
DELETE FROM user_preferences;
DELETE FROM user_security;

-- Reset the users table to only keep essential auth data
UPDATE users SET first_name = NULL, last_name = NULL, phone = NULL, date_of_birth = NULL;
