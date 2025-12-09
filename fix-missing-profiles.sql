-- ===================================================================
-- FIX: Create Missing Profiles for Existing Users
-- ===================================================================
-- This script creates profiles for any auth.users that don't have one yet
-- Run this in Supabase SQL Editor if you have login issues
-- ===================================================================

-- Insert missing profiles for existing auth users
INSERT INTO public.profiles (id, name, email, phone)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'name', 'User') as name,
    u.email,
    u.raw_user_meta_data->>'phone' as phone
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the fix
SELECT 
    COUNT(*) as total_users,
    COUNT(p.id) as users_with_profiles
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
