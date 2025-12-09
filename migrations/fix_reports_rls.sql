-- Fix Reports RLS Policy
-- Previously allowed all authenticated users to view all reports.
-- Now restricts view access to the reporter only.

DROP POLICY IF EXISTS "Admins can view reports" ON public.reports;

CREATE POLICY "Users can view their own reports"
    ON public.reports FOR SELECT
    TO authenticated
    USING (auth.uid() = reporter_id);
