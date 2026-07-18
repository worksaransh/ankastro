-- =====================================================================
-- 10_report_email.sql — email delivery support (Phase 2)
-- Adds emailed_at to report_orders so report email sends only once.
-- Project: kassdsugfktqptsxzqhr. Run AFTER 09_phase1_reports.sql.
-- =====================================================================
ALTER TABLE public.report_orders ADD COLUMN IF NOT EXISTS emailed_at timestamptz;

-- Verify:
-- SELECT cashfree_order_id, status, emailed_at FROM public.report_orders ORDER BY created_at DESC LIMIT 5;
