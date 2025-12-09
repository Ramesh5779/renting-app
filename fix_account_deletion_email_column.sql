-- Fix: Add email column to account_deletion_requests table
-- Run this in Supabase SQL Editor if the email column is missing

-- Add email column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'account_deletion_requests' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE public.account_deletion_requests 
        ADD COLUMN email TEXT NOT NULL DEFAULT '';
        
        -- Update existing rows with email from auth.users
        UPDATE public.account_deletion_requests adr
        SET email = (
            SELECT au.email 
            FROM auth.users au 
            WHERE au.id = adr.user_id
        );
        
        RAISE NOTICE 'Email column added to account_deletion_requests table';
    ELSE
        RAISE NOTICE 'Email column already exists';
    END IF;
END $$;
