-- The profiles_public view already excludes email (only id, full_name, avatar_url, is_active)
-- But the policy on profiles allows SELECT on all columns including email
-- We need to deny direct access to profiles for this purpose

-- Drop the overly permissive policy that exposes emails
DROP POLICY IF EXISTS "Authenticated users can view active profiles via view" ON public.profiles;

-- The existing policies already handle proper access:
-- - "Users can view own profile" (users see their own full profile including email)
-- - "Admins can view all profiles" (admins see everything)

-- For the leaderboard feature, we use profiles_public view which only shows
-- id, full_name, avatar_url, is_active - no email

-- The view with security_invoker will work because users can view their own profile
-- and admins can view all profiles. For the leaderboard showing other users,
-- we need to allow viewing just the public fields

-- Create a function-based approach to check if accessing via the view
-- Actually, let's just update the code to not use profiles_public for leaderboard
-- Instead let the view work by creating a function

-- Better approach: Create a security definer function that returns public profile data
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  is_active boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, full_name, avatar_url, is_active
  FROM public.profiles
  WHERE is_active = true;
$$;