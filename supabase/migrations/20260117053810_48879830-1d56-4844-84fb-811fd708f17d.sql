-- Create login_attempts table to track failed login attempts
CREATE TABLE public.login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  email TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT false
);

-- Create index for efficient lookups
CREATE INDEX idx_login_attempts_ip_time ON public.login_attempts (ip_address, attempted_at DESC);
CREATE INDEX idx_login_attempts_email_time ON public.login_attempts (email, attempted_at DESC);

-- Enable RLS (only service role should access this table)
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- No public policies - only accessible via service role in edge functions

-- Create function to check rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_address TEXT,
  p_email TEXT DEFAULT NULL,
  p_window_minutes INTEGER DEFAULT 15,
  p_max_attempts INTEGER DEFAULT 5
)
RETURNS TABLE(is_blocked BOOLEAN, attempts_count INTEGER, retry_after_seconds INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_ip_attempts INTEGER;
  v_email_attempts INTEGER;
  v_total_attempts INTEGER;
  v_oldest_attempt TIMESTAMP WITH TIME ZONE;
  v_retry_seconds INTEGER;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Count IP-based attempts
  SELECT COUNT(*) INTO v_ip_attempts
  FROM public.login_attempts
  WHERE ip_address = p_ip_address
    AND attempted_at > v_window_start
    AND success = false;
  
  -- Count email-based attempts if email provided
  IF p_email IS NOT NULL THEN
    SELECT COUNT(*) INTO v_email_attempts
    FROM public.login_attempts
    WHERE email = p_email
      AND attempted_at > v_window_start
      AND success = false;
  ELSE
    v_email_attempts := 0;
  END IF;
  
  -- Use the higher of the two counts
  v_total_attempts := GREATEST(v_ip_attempts, v_email_attempts);
  
  -- Calculate retry_after if blocked
  IF v_total_attempts >= p_max_attempts THEN
    SELECT MIN(attempted_at) INTO v_oldest_attempt
    FROM public.login_attempts
    WHERE (ip_address = p_ip_address OR email = p_email)
      AND attempted_at > v_window_start
      AND success = false;
    
    v_retry_seconds := EXTRACT(EPOCH FROM (v_oldest_attempt + (p_window_minutes || ' minutes')::INTERVAL - now()))::INTEGER;
    v_retry_seconds := GREATEST(v_retry_seconds, 0);
  ELSE
    v_retry_seconds := 0;
  END IF;
  
  RETURN QUERY SELECT 
    (v_total_attempts >= p_max_attempts) AS is_blocked,
    v_total_attempts AS attempts_count,
    v_retry_seconds AS retry_after_seconds;
END;
$$;

-- Create function to record login attempt
CREATE OR REPLACE FUNCTION public.record_login_attempt(
  p_ip_address TEXT,
  p_email TEXT,
  p_success BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.login_attempts (ip_address, email, success)
  VALUES (p_ip_address, p_email, p_success);
  
  -- Cleanup old records (older than 24 hours)
  DELETE FROM public.login_attempts
  WHERE attempted_at < now() - INTERVAL '24 hours';
END;
$$;

-- Create function to clear attempts on successful login
CREATE OR REPLACE FUNCTION public.clear_login_attempts(
  p_ip_address TEXT,
  p_email TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.login_attempts
  WHERE ip_address = p_ip_address OR email = p_email;
END;
$$;