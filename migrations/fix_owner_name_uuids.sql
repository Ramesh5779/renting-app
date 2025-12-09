-- Fix existing listings where owner_name is a UUID
-- This updates owner_name with the actual user name from the profiles table

UPDATE room_listings
SET owner_name = profiles.name
FROM profiles
WHERE room_listings.owner_id = profiles.id
  AND room_listings.owner_name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'; -- Only update if it's a UUID

-- This query:
-- 1. Finds all listings where owner_name looks like a UUID
-- 2. Joins with the profiles table using owner_id
-- 3. Updates owner_name with the actual user's name from profiles
