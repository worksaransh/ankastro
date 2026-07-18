-- =====================================================================
-- Premium CRO sections seed for name-correction-report page
-- Adds: trust_stats, before_after, report_preview blocks
-- (NBT-style high-conversion layout). Images blank — admin se bharo.
-- Run AFTER 06_seed_landing_pages.sql.
-- =====================================================================
DO $$
DECLARE pid uuid;
BEGIN
  SELECT id INTO pid FROM public.landing_pages WHERE slug = 'name-correction-report';
  IF pid IS NULL THEN RAISE NOTICE 'page not found'; RETURN; END IF;

  -- remove any existing premium blocks (idempotent re-run)
  DELETE FROM public.page_blocks WHERE page_id = pid AND type IN ('trust_stats','before_after','report_preview','carousel');

  -- Trust stats (after hero, position 0 so it shows near top)
  INSERT INTO public.page_blocks (page_id, type, content, position) VALUES
  (pid, 'trust_stats', '{"items":[{"value":"4.9","label":"Rating"},{"value":"50K+","label":"Reports banayi"},{"value":"24hr","label":"Delivery"},{"value":"98%","label":"Satisfaction"}]}', 0),

  (pid, 'before_after', '{"title":"Naam sudhaar ke baad kya badalta hai?","before":{"name":"RAHUL","planet":"Shani","number":"4","bars":[{"label":"Career","value":42},{"label":"Dhan","value":36},{"label":"Pehchaan","value":48},{"label":"Rishte","value":40}]},"after":{"name":"RAAHUL","planet":"Surya","number":"1","bars":[{"label":"Career","value":86},{"label":"Dhan","value":79},{"label":"Pehchaan","value":92},{"label":"Rishte","value":83}]}}', 11),

  (pid, 'report_preview', '{"title":"Dekhein aapki report kaisi dikhti hai","subtitle":"Aapke naam aur janm vivaran ke according","pages":[],"insideItems":["Name number analysis","Bhagya aur jeevan path","3-5 naam spelling options","Lucky ank aur rang","Upay aur margdarshan"]}', 12);

  RAISE NOTICE 'Premium sections added to name-correction-report';
END $$;

-- Verify:
-- SELECT type, position FROM page_blocks pb JOIN landing_pages lp ON lp.id=pb.page_id WHERE lp.slug='name-correction-report' ORDER BY position;
