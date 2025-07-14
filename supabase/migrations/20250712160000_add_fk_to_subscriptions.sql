-- Add foreign key constraint to subscriptions
ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES public.products(id)
ON DELETE CASCADE;
