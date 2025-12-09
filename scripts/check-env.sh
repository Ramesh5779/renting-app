#!/bin/bash

if [ ! -f .env ]; then
  echo "❌ No .env found!"
  exit 1
fi

if ! grep -q "EXPO_PUBLIC_SUPABASE_URL" .env; then
  echo "❌ Supabase URL missing!"
  exit 1
fi

if ! grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
  echo "❌ Supabase key missing!"
  exit 1
fi

echo "✅ Environment OK"
