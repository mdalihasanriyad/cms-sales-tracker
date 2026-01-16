-- Fix 1: Drop the overly permissive policy on profiles table that exposes emails
DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.profiles;

-- Fix 2: Enable RLS on profiles_public view and add appropriate policy
-- First, we need to recreate the view with security_invoker to respect RLS
DROP VIEW IF EXISTS public.profiles_public;

-- Recreate the view with security_invoker enabled
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT 
  id,
  full_name,
  avatar_url,
  is_active
FROM public.profiles
WHERE is_active = true;