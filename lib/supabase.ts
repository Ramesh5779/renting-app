import { logger } from '@/utils/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

const supabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    Constants.expoConfig?.extra?.supabaseUrl;

const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    Constants.expoConfig?.extra?.supabaseAnonKey;

// HARD ERROR — NO FALLBACK ALLOWED
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(`
❌ Supabase credentials missing!

Add to .env:
  EXPO_PUBLIC_SUPABASE_URL=
  EXPO_PUBLIC_SUPABASE_ANON_KEY=

Then restart with: npx expo start -c
`);
}

logger.log('🔗 Supabase Initialized', {
    urlLength: supabaseUrl.length,
    keyLength: supabaseAnonKey.length,
    usingConstantsFallback: !process.env.EXPO_PUBLIC_SUPABASE_URL
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});
