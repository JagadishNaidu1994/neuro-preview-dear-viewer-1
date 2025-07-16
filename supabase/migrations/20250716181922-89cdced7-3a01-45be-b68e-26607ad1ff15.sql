-- Add new columns to reviews table for enhanced functionality
ALTER TABLE public.reviews 
ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN admin_reply TEXT,
ADD COLUMN is_important BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN admin_reply_date TIMESTAMP WITH TIME ZONE;

-- Create email_logs table for tracking sent emails
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to subscriptions table for enhanced management
ALTER TABLE public.subscriptions 
ADD COLUMN skipped_deliveries JSONB DEFAULT '[]'::jsonb,
ADD COLUMN payment_method_id UUID REFERENCES public.user_payment_methods(id) ON DELETE SET NULL;

-- Enable RLS on email_logs table
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for email_logs
CREATE POLICY "Admins can manage email logs" 
ON public.email_logs 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own email logs" 
ON public.email_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_reviews_archived ON public.reviews(archived) WHERE archived = false;
CREATE INDEX idx_reviews_important ON public.reviews(is_important) WHERE is_important = true;
CREATE INDEX idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX idx_email_logs_order_id ON public.email_logs(order_id);
CREATE INDEX idx_subscriptions_user_status ON public.subscriptions(user_id, status);

-- Create CLV view for analytics
CREATE OR REPLACE VIEW customer_lifetime_value AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    COUNT(o.id) as total_orders,
    COALESCE(AVG(o.total_amount), 0) as avg_order_value,
    MIN(o.created_at) as first_order_date,
    MAX(o.created_at) as last_order_date,
    EXTRACT(DAYS FROM (MAX(o.created_at) - MIN(o.created_at))) as customer_lifetime_days
FROM public.users u
LEFT JOIN public.orders o ON u.id = o.user_id
GROUP BY u.id, u.email, u.first_name, u.last_name
ORDER BY total_spent DESC;