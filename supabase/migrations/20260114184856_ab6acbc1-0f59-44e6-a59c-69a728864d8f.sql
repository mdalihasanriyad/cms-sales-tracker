-- Fix 1: Restrict profiles table - users can only view own profile, admins can view all
-- Create a public view for leaderboard functionality (name + avatar only)

DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create a limited public view for leaderboard (excludes sensitive data like email, monthly_target)
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = on) AS
  SELECT id, full_name, avatar_url, is_active
  FROM public.profiles;

-- Fix 2: Restrict monthly_meta table - only admins can view
DROP POLICY IF EXISTS "Anyone can view monthly meta" ON public.monthly_meta;

CREATE POLICY "Admins can view monthly meta"
  ON public.monthly_meta FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));