-- Enable RLS on the profiles_public view and add policy for authenticated users
ALTER VIEW public.profiles_public SET (security_invoker = on);

-- Add RLS policy to allow only authenticated users to view public profiles
CREATE POLICY "Authenticated users can view public profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Note: The view inherits RLS from the underlying profiles table via security_invoker=on