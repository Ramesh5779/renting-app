-- ==============================================================================
-- 🚀 RENTING APP COMPLETE ROBUST DATABASE SCHEMA
-- ==============================================================================
-- Run this entire script in the Supabase SQL Editor to set up your database.
-- NOTE: This will DELETE ALL EXISTING DATA in these tables.
-- ==============================================================================

-- 1. CLEANUP (Drop existing objects to ensure a clean slate)
-- ==============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

DROP TABLE IF EXISTS public.account_deletion_requests CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.saved_listings CASCADE;
DROP TABLE IF EXISTS public.room_listings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. TABLES
-- ==============================================================================

-- 3.1 PROFILES
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 ROOM LISTINGS
CREATE TABLE public.room_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    street TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    house_rules TEXT,
    room_type TEXT NOT NULL CHECK (room_type IN ('private', 'shared')),
    available_from DATE,
    owner_name TEXT NOT NULL,
    owner_contact TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 SAVED LISTINGS
CREATE TABLE public.saved_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES public.room_listings(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- 3.4 REPORTS
CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.room_listings(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 ACCOUNT DELETION REQUESTS
CREATE TABLE public.account_deletion_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES (For Performance)
-- ==============================================================================
CREATE INDEX idx_room_listings_owner_id ON public.room_listings(owner_id);
CREATE INDEX idx_room_listings_created_at ON public.room_listings(created_at DESC);
CREATE INDEX idx_saved_listings_user_id ON public.saved_listings(user_id);
CREATE INDEX idx_saved_listings_listing_id ON public.saved_listings(listing_id);
CREATE INDEX idx_reports_listing_id ON public.reports(listing_id);
CREATE INDEX idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX idx_account_deletion_requests_user_id ON public.account_deletion_requests(user_id);

-- 5. ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- 5.1 PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 5.2 ROOM LISTINGS POLICIES
CREATE POLICY "Room listings are viewable by everyone"
    ON public.room_listings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create listings"
    ON public.room_listings FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own listings"
    ON public.room_listings FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own listings"
    ON public.room_listings FOR DELETE
    USING (auth.uid() = owner_id);

-- 5.3 SAVED LISTINGS POLICIES
CREATE POLICY "Users can view their own saved listings"
    ON public.saved_listings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings"
    ON public.saved_listings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave listings"
    ON public.saved_listings FOR DELETE
    USING (auth.uid() = user_id);

-- 5.4 REPORTS POLICIES
CREATE POLICY "Users can create reports"
    ON public.reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view reports"
    ON public.reports FOR SELECT
    TO authenticated
    USING (true); -- Ideally restrict to admin role, but 'true' allows all auth users for now

-- 5.5 ACCOUNT DELETION REQUESTS POLICIES
CREATE POLICY "Users can create own deletion requests"
    ON public.account_deletion_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own deletion requests"
    ON public.account_deletion_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own pending deletion requests"
    ON public.account_deletion_requests FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'pending');

-- 6. FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 6.1 Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_listings_updated_at
    BEFORE UPDATE ON public.room_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_account_deletion_requests_updated_at
    BEFORE UPDATE ON public.account_deletion_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6.2 Auto-create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        NEW.email,
        NEW.raw_user_meta_data->>'phone'
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        RETURN NEW; -- Profile exists, ignore
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. STORAGE SETUP (Run if needed)
-- ==============================================================================
-- This part attempts to set up the storage bucket. 
-- If 'room-images' already exists, these might fail or be ignored.

-- Create the storage bucket 'room-images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-images', 'room-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'room-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'room-images' );

-- Allow users to update their own images (optional, usually delete/insert is enough)
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'room-images' AND auth.uid() = owner );

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'room-images' AND auth.uid() = owner );

-- ==============================================================================
-- ✅ SETUP COMPLETE
-- ==============================================================================
