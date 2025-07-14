CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO pages (page_key, content) VALUES
('faq', '{"title": "Frequently Asked Questions", "introduction": "Here are some of our most frequently asked questions."}'),
('shipping-returns', '{"title": "Shipping & Returns", "policy": "Our shipping and returns policy is as follows..."}');
