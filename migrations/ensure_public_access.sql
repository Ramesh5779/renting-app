-- Enable public read access for room_listings
-- This ensures guests can view listings without being logged in

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Public read listings" ON room_listings;

-- Create the policy
CREATE POLICY "Public read listings"
ON room_listings
FOR SELECT
USING (true);

-- Ensure RLS is enabled on the table
ALTER TABLE room_listings ENABLE ROW LEVEL SECURITY;
