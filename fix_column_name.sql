-- Fix: Standardize on 'email' column for account_deletion_requests
-- Run this in Supabase SQL Editor

DO $$ 
BEGIN
    -- Case 1: Both columns exist (email and user_email)
    -- We want to keep 'email' and remove 'user_email'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account_deletion_requests' AND column_name = 'email') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account_deletion_requests' AND column_name = 'user_email') THEN
        
        -- Copy data from user_email to email if email is empty
        UPDATE public.account_deletion_requests 
        SET email = user_email 
        WHERE email = '' OR email IS NULL;
        
        -- Drop the user_email column
        ALTER TABLE public.account_deletion_requests DROP COLUMN user_email;
        RAISE NOTICE 'Dropped user_email column (email column already existed)';
        
    -- Case 2: Only user_email exists
    -- We want to rename it to 'email'
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account_deletion_requests' AND column_name = 'email') 
          AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account_deletion_requests' AND column_name = 'user_email') THEN
          
        ALTER TABLE public.account_deletion_requests RENAME COLUMN user_email TO email;
        RAISE NOTICE 'Renamed user_email to email';
        
    -- Case 3: Only email exists (Ideal state)
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account_deletion_requests' AND column_name = 'email') THEN
        RAISE NOTICE 'Table already has correct schema (email column exists)';
        
    ELSE
        RAISE NOTICE 'Unexpected state: neither email nor user_email columns found';
    END IF;
END $$;
