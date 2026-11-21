-- Fix authenticated REST access for admin queues and dashboard totals.
-- Existing row-level security policies continue to restrict accessible rows.
BEGIN;

GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.custom_requests TO authenticated;
GRANT SELECT, INSERT ON public.seller_applications TO authenticated;

COMMIT;
