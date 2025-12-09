# Quick Supabase Setup Guide

## ✅ Your Credentials Are Configured!

Your `.env` file is set up with:
- **Project URL**: `https://legnhikgjqgrkudfisio.supabase.co`
- **Anon Key**: Configured ✓

## 🚀 Next Steps (5 minutes)

### Step 1: Set Up Database Schema

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/legnhikgjqgrkudfisio/sql
   
2. **Run the Schema**:
   - Click **"New Query"**
   - Open the file: `supabase-schema.sql` (in your project root)
   - Copy ALL the SQL code
   - Paste it into the SQL Editor
   - Click **"Run"** (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned" ✓

### Step 2: Create Storage Bucket

1. **Go to Storage**:
   - Click **Storage** in the Supabase sidebar
   - Click **"Create a new bucket"**

2. **Configure Bucket**:
   - **Name**: `room-images`
   - **Public bucket**: ✅ CHECK THIS BOX (important!)
   - Click **"Create bucket"**

3. **Set Storage Policies**:
   - Click on the `room-images` bucket
   - Click **"Policies"** tab
   - Click **"New Policy"** → **"For full customization"**
   
   Create 4 policies:

   **Policy 1: Public Read**
   - Name: `Public read access`
   - Operation: `SELECT`
   - Policy: `bucket_id = 'room-images'`

   **Policy 2: Authenticated Upload**
   - Name: `Authenticated upload`
   - Operation: `INSERT`
   - Policy: `bucket_id = 'room-images' AND auth.role() = 'authenticated'`

   **Policy 3: Update Own Images**
   - Name: `Users update own images`
   - Operation: `UPDATE`
   - Policy: `bucket_id = 'room-images' AND auth.uid()::text = (storage.foldername(name))[1]`

   **Policy 4: Delete Own Images**
   - Name: `Users delete own images`
   - Operation: `DELETE`
   - Policy: `bucket_id = 'room-images' AND auth.uid()::text = (storage.foldername(name))[1]`

### Step 3: Verify Setup

After completing the above:

1. **Check Tables**:
   - Go to **Table Editor** in Supabase
   - You should see: `profiles`, `room_listings`, `saved_listings`

2. **Check Storage**:
   - Go to **Storage**
   - You should see the `room-images` bucket with a 🌐 (public) icon

3. **Restart Your App**:
   - The Expo server is now running with cleared cache
   - Your app should connect to Supabase successfully!

## 🎉 You're Done!

Once you complete these steps, your app will:
- ✅ Store listings in Supabase database
- ✅ Upload images to Supabase Storage
- ✅ Sync data across all devices
- ✅ Be ready for user authentication

## 📱 Test It Out

Try creating a new listing in your app, then check the Supabase dashboard to see your data!

---

**Need help?** Check the full guide: [SUPABASE_SETUP.md](file:///Users/rameshkumar/renting-app/SUPABASE_SETUP.md)
