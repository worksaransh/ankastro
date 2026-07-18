-- =====================================================================
-- 12_new_report_types.sql — Business, Property, Marriage reports
-- report_types me 3 naye rows. Static content code me hai; ye DB rows
-- price/checkout/admin ke liye. Project: kassdsugfktqptsxzqhr.
-- Run AFTER 05 + 09. PURA copy karke chalao.
-- =====================================================================
INSERT INTO public.report_types (key, name, short_desc, price, original_price, slug, badge, icon, active, sort_order)
VALUES
  ('business_numerology', 'Business Numerology Report', 'Business naam, timing & growth', 499, 1499, 'business-numerology-report', '', 'building', true, 7),
  ('property_numerology', 'Property & House Number Report', 'Shubh ghar/plot number', 299, 799, 'property-numerology-report', '', 'home', true, 8),
  ('marriage_report', 'Marriage Timing & Matching Report', 'Shaadi timing + compatibility', 449, 999, 'marriage-report', 'Couples', 'heart', true, 9)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name, price = EXCLUDED.price, original_price = EXCLUDED.original_price,
  slug = EXCLUDED.slug, badge = EXCLUDED.badge, active = EXCLUDED.active, sort_order = EXCLUDED.sort_order;

-- Verify:
-- SELECT key, name, price, slug FROM public.report_types ORDER BY sort_order;  -- 9 rows
