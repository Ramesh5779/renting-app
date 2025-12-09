# Supabase Setup Guide for Renting App

This guide will walk you through setting up Supabase for your renting app.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Your renting app project

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in the details:
   - **Organization**: Select or create one
   - **Name**: `renting-app` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is fine for development
5. Click **"Create new project"**
6. Wait ~2 minutes for the project to be provisioned

## Step 2: Get API Credentials

1. In your Supabase dashboard, click on **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)
4. Keep this page open - you'll need these values in Step 5

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the sidebar
2. Click **"New Query"**
3. Copy and paste the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room listings table
CREATE TABLE public.room_listings (
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
);

-- Saved listings (favorites) table
CREATE TABLE public.saved_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.room_listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Create indexes for better performance
CREATE INDEX idx_room_listings_owner_id ON public.room_listings(owner_id);
CREATE INDEX idx_room_listings_created_at ON public.room_listings(created_at DESC);
CREATE INDEX idx_saved_listings_user_id ON public.saved_listings(user_id);
CREATE INDEX idx_saved_listings_listing_id ON public.saved_listings(listing_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Room listings policies
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

-- Saved listings policies
CREATE POLICY "Users can view their own saved listings"
  ON public.saved_listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings"
  ON public.saved_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave listings"
  ON public.saved_listings FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_listings_updated_at
  BEFORE UPDATE ON public.room_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"Run"** or press `Cmd/Ctrl + Enter`
5. You should see "Success. No rows returned" - this is correct!

## Step 4: Set Up Storage Bucket

1. In your Supabase dashboard, click on **Storage** in the sidebar
2. Click **"Create a new bucket"**
3. Enter the bucket name: `room-images`
4. **Important**: Check the **"Public bucket"** checkbox
5. Click **"Create bucket"**

### Set Storage Policies

1. Click on the `room-images` bucket you just created
2. Click on **"Policies"** tab
3. Click **"New Policy"**
4. Click **"For full customization"** (not a template)
5. Create the following policies one by one:

**Policy 1: Public Read Access**
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition:
```sql
bucket_id = 'room-images'
```

**Policy 2: Authenticated Upload**
- Policy name: `Authenticated users can upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition:
```sql
bucket_id = 'room-images' AND auth.role() = 'authenticated'
```

**Policy 3: Users Can Update Their Images**
- Policy name: `Users can update their own images`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- Policy definition:
```sql
bucket_id = 'room-images' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 4: Users Can Delete Their Images**
- Policy name: `Users can delete their own images`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- Policy definition:
```sql
bucket_id = 'room-images' AND auth.uid()::text = (storage.foldername(name))[1]
```

## Step 5: Configure Environment Variables

1. In your project root, create a file named `.env`
2. Add your Supabase credentials (from Step 2):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the values with your actual credentials
4. Save the file

**Important**: The `.env` file is already in `.gitignore`, so it won't be committed to version control.

## Step 6: Restart Your Development Server

1. Stop your current Expo server (press `Ctrl+C` in the terminal)
2. Restart it:
```bash
npx expo start
```

3. The app will now use Supabase for all data storage!

## Verification

To verify everything is working:

1. **Check Database Connection**:
   - Try creating a new room listing in your app
   - Go to Supabase dashboard → **Table Editor** → `room_listings`
   - You should see your listing there!

2. **Check Image Upload**:
   - Add images when creating a listing
   - Go to Supabase dashboard → **Storage** → `room-images`
   - You should see your uploaded images!

3. **Check Authentication** (when you implement auth flows):
   - Sign up a new user
   - Go to Supabase dashboard → **Authentication** → **Users**
   - You should see the new user!

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct credentials
- Make sure you copied the **anon/public** key, not the service role key
- Restart your Expo server after changing `.env`

### "relation does not exist" error
- Make sure you ran the SQL schema in Step 3
- Check the **Table Editor** in Supabase to verify tables exist

### Images not uploading
- Verify the `room-images` bucket is **public**
- Check that storage policies are set up correctly
- Look for errors in the console

### Data not persisting
- Check your internet connection
- Verify your Supabase project is active (not paused)
- Check the browser console for error messages

### "Email not confirmed" error
- By default, Supabase requires email verification.
- **For Development**: Go to Authentication -> Providers -> Email -> Disable "Confirm email".
- **For Production**: Keep it enabled and check your email inbox for the confirmation link.

## Next Steps

Now that Supabase is integrated, you can:

1. **Add Authentication UI**: Create sign-up and login screens
2. **Test Multi-device Sync**: Your data now syncs across devices!
3. **Add Real-time Features**: Use Supabase real-time subscriptions
4. **Deploy**: Your app is ready for production!

## Support

If you encounter issues:
- Check [Supabase Documentation](https://supabase.com/docs)
- Visit [Supabase Discord](https://discord.supabase.com)
- Review the implementation plan for detailed code explanations
