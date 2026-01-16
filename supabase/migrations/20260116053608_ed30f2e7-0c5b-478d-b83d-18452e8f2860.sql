-- Drop the profiles_public view since we now use the get_public_profiles() function
-- This eliminates the security concern about the unprotected view
DROP VIEW IF EXISTS public.profiles_public;