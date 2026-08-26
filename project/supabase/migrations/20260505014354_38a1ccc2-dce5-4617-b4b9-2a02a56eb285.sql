
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;

CREATE POLICY "Scoped analytics insert"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event IS NOT NULL
  AND length(event) BETWEEN 1 AND 100
  AND (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  )
);
