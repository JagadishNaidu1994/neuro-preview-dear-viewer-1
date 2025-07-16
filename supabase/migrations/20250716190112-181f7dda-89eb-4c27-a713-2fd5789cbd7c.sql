-- Fix expense categories deletion issue by updating RLS policies
DROP POLICY IF EXISTS "Allow all users to view categories" ON public.expense_categories;
DROP POLICY IF EXISTS "Allow all users to create categories" ON public.expense_categories;

-- Create proper RLS policies for expense categories
CREATE POLICY "Admins can manage expense categories" 
ON public.expense_categories 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Add review likes/dislikes functionality
CREATE TABLE IF NOT EXISTS public.review_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  is_like BOOLEAN NOT NULL, -- true for like, false for dislike
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Enable RLS on review_likes
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for review likes
CREATE POLICY "Users can manage their own review likes" 
ON public.review_likes 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view review likes" 
ON public.review_likes 
FOR SELECT 
USING (true);

-- Add gender column to users table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'gender') THEN
        ALTER TABLE public.users ADD COLUMN gender TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved ON public.reviews(product_id, is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_review_likes_review_id ON public.review_likes(review_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);