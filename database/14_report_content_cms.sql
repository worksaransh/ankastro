-- =====================================================================
-- 14_report_content_cms.sql — report content DB CMS + 3-language
-- Har report ka marketing content (title, pains, faqs, etc.) ab DB me
-- per-language. Static code FALLBACK rahega (kuch break nahi hoga).
-- + per-report coupon (coupon kisi ek report par bhi laga sakte ho).
-- Project: kassdsugfktqptsxzqhr. PURA copy karke chalao.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.report_content (
  key        text NOT NULL,         -- report key (e.g. business_numerology)
  lang       text NOT NULL,         -- 'hinglish' | 'en' | 'hi'
  content    jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (key, lang)
);

GRANT SELECT ON public.report_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.report_content TO authenticated;

ALTER TABLE public.report_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rc_read ON public.report_content;
CREATE POLICY rc_read ON public.report_content FOR SELECT USING (true);

DROP POLICY IF EXISTS rc_admin_ins ON public.report_content;
CREATE POLICY rc_admin_ins ON public.report_content FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS rc_admin_upd ON public.report_content;
CREATE POLICY rc_admin_upd ON public.report_content FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS rc_admin_del ON public.report_content;
CREATE POLICY rc_admin_del ON public.report_content FOR DELETE USING (public.is_admin());

-- per-report coupon (NULL = sab reports par; warna sirf us report par)
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS report_key text;

-- Verify:
-- SELECT key, lang, updated_at FROM public.report_content;
