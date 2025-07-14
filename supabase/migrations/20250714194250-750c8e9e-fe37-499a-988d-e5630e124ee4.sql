
-- Create the pages table for content management
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the expenses table for expense tracking
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pages (admin only)
CREATE POLICY "Admins can manage pages" 
  ON public.pages 
  FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create RLS policies for expenses (admin only)  
CREATE POLICY "Admins can manage expenses" 
  ON public.expenses 
  FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Insert some sample page content
INSERT INTO public.pages (page_key, content) VALUES 
  ('home', '{"hero_title": "Welcome to DearNeuro", "hero_subtitle": "Premium supplements for your health"}'),
  ('about', '{"title": "About Us", "description": "We are committed to providing high-quality supplements"}'),
  ('contact', '{"title": "Contact Us", "phone": "+1-234-567-8900", "email": "support@dearneuro.com"}');
