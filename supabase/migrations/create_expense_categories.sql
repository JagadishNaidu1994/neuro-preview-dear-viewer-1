-- Create the expense_categories table
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all users to view categories"
ON expense_categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all users to create categories"
ON expense_categories
FOR INSERT
TO authenticated
WITH CHECK (true);
