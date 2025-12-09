-- Fix the foreign key constraint to cascade deletes
-- This allows reports to be automatically deleted when a listing is deleted

-- Drop the existing foreign key constraint
ALTER TABLE public.reports 
DROP CONSTRAINT IF EXISTS reports_listing_id_fkey;

-- Add the foreign key constraint with CASCADE delete
ALTER TABLE public.reports 
ADD CONSTRAINT reports_listing_id_fkey 
FOREIGN KEY (listing_id) 
REFERENCES public.room_listings(id) 
ON DELETE CASCADE;
