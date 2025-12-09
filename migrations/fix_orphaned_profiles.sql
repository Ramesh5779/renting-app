-- 1. Delete orphaned profiles (profiles with no matching auth user)
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Drop the existing foreign key constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Re-add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4. Ensure email is unique in profiles to prevent duplicates
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_email_key UNIQUE (email);
