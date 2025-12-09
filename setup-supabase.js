#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * This script automatically sets up the database schema for the renting app
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Supabase credentials not found in .env file');
    console.error('Please make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    console.log('🚀 Starting Supabase database setup...\n');

    const queries = [
        {
            name: 'Enable UUID extension',
            sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'
        },
        {
            name: 'Create profiles table',
            sql: `CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        profile_image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
        },
        {
            name: 'Create room_listings table',
            sql: `CREATE TABLE IF NOT EXISTS public.room_listings (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
        owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
        owner_name TEXT NOT NULL,
        owner_contact TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
        },
        {
            name: 'Create saved_listings table',
            sql: `CREATE TABLE IF NOT EXISTS public.saved_listings (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
        listing_id UUID REFERENCES public.room_listings(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, listing_id)
      )`
        },
        {
            name: 'Create indexes',
            sql: `
        CREATE INDEX IF NOT EXISTS idx_room_listings_owner_id ON public.room_listings(owner_id);
        CREATE INDEX IF NOT EXISTS idx_room_listings_created_at ON public.room_listings(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_saved_listings_user_id ON public.saved_listings(user_id);
        CREATE INDEX IF NOT EXISTS idx_saved_listings_listing_id ON public.saved_listings(listing_id);
      `
        },
        {
            name: 'Enable Row Level Security',
            sql: `
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.room_listings ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
      `
        },
        {
            name: 'Create update function',
            sql: `CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`
        },
        {
            name: 'Create triggers',
            sql: `
        DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
        DROP TRIGGER IF EXISTS update_room_listings_updated_at ON public.room_listings;
        
        CREATE TRIGGER update_profiles_updated_at
          BEFORE UPDATE ON public.profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_room_listings_updated_at
          BEFORE UPDATE ON public.room_listings
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
        }
    ];

    for (const query of queries) {
        try {
            console.log(`⏳ ${query.name}...`);
            const { error } = await supabase.rpc('exec_sql', { sql: query.sql });

            if (error) {
                console.error(`❌ Error in ${query.name}:`, error.message);
            } else {
                console.log(`✅ ${query.name} - Done`);
            }
        } catch (err) {
            console.error(`❌ Error in ${query.name}:`, err.message);
        }
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to Supabase dashboard and manually set up RLS policies');
    console.log('2. Create the room-images storage bucket');
    console.log('3. Set up storage policies');
    console.log('\nSee QUICK_SETUP.md for detailed instructions.');
}

setupDatabase().catch(console.error);
