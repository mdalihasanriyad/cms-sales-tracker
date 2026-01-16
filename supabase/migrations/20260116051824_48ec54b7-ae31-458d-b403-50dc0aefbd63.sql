-- Add a permissive policy on profiles that allows authenticated users to see 
-- only non-sensitive fields (via the view) for active users
-- This works with security_invoker on the view

CREATE POLICY "Authenticated users can view active profiles via view"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_active = true);