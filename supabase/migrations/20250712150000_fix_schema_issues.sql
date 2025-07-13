-- Add foreign key constraint to wishlist_items
ALTER TABLE public.wishlist_items
ADD CONSTRAINT wishlist_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES public.products(id)
ON DELETE CASCADE;

-- Add frequency column to subscriptions
ALTER TABLE public.subscriptions
ADD COLUMN frequency VARCHAR(255);
