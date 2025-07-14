
-- Enable RLS on reviews table if not already enabled
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews table
-- Allow anyone to read approved reviews
CREATE POLICY "Anyone can view approved reviews" 
  ON reviews 
  FOR SELECT 
  USING (is_approved = true);

-- Allow authenticated users to create reviews
CREATE POLICY "Authenticated users can create reviews" 
  ON reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own reviews (approved or not)
CREATE POLICY "Users can view own reviews" 
  ON reviews 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to manage all reviews
CREATE POLICY "Admins can manage reviews" 
  ON reviews 
  FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
