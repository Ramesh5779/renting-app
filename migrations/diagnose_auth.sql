-- Diagnostic Script for Authentication Issues
-- Run this in Supabase SQL Editor to check for common problems

-- 1. Check if trigger function exists
SELECT 
    routine_name,
    routine_type,
    routine_schema
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 2. Check if trigger is correctly configured
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 3. Check for orphaned auth.users (users without profiles)
SELECT 
    u.id,
    u.email,
    u.created_at,
    u.email_confirmed_at,
    p.id as profile_id
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC
LIMIT 10;

-- 4. Check for duplicate emails in profiles
SELECT 
    email,
    COUNT(*) as count
FROM public.profiles
GROUP BY email
HAVING COUNT(*) > 1;

-- 5. Check RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'profiles';

-- 6. Check recent auth.users (last 10)
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    confirmed_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 7. Check recent profiles (last 10)
SELECT 
    id,
    email,
    name,
    phone,
    created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- 8. Test the trigger function manually (optional - only if you want to test)
-- DO $$
-- DECLARE
--     test_user_id uuid := gen_random_uuid();
--     test_email text := 'test@example.com';
-- BEGIN
--     -- This is just a test, won't actually create a user
--     RAISE NOTICE 'Testing trigger function...';
--     RAISE NOTICE 'Function exists: %', EXISTS(
--         SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user'
--     );
-- END $$;
