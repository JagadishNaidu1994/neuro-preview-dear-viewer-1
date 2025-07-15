-- Add assigned_users field to coupon_codes table to support user-specific coupons
ALTER TABLE public.coupon_codes 
ADD COLUMN assigned_users TEXT;

-- Add usage tracking table for individual user coupon usage
CREATE TABLE public.coupon_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  coupon_id UUID NOT NULL REFERENCES public.coupon_codes(id) ON DELETE CASCADE,
  used_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, coupon_id)
);

-- Enable RLS on coupon_usage table
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for coupon_usage
CREATE POLICY "Users can view their own coupon usage" 
ON public.coupon_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own coupon usage" 
ON public.coupon_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage" 
ON public.coupon_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all coupon usage" 
ON public.coupon_usage 
FOR ALL 
USING (is_admin(auth.uid()));

-- Add utilized_points to user_rewards table
ALTER TABLE public.user_rewards 
ADD COLUMN utilized_points INTEGER DEFAULT 0;

-- Create trigger for coupon_usage updated_at
CREATE OR REPLACE FUNCTION public.update_coupon_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coupon_usage_updated_at
BEFORE UPDATE ON public.coupon_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_coupon_usage_updated_at();