import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthRequest {
  email: string
  password: string
  action: 'signin' | 'signup'
  fullName?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get client IP from headers
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'

    console.log(`Auth request from IP: ${ipAddress}`)

    const { email, password, action, fullName }: AuthRequest = await req.json()

    if (!email || !password || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create service role client for rate limit operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Check rate limit (5 attempts per 15 minutes)
    const { data: rateLimitData, error: rateLimitError } = await supabaseAdmin
      .rpc('check_rate_limit', {
        p_ip_address: ipAddress,
        p_email: email,
        p_window_minutes: 15,
        p_max_attempts: 5
      })

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const rateLimit = rateLimitData?.[0]
    
    if (rateLimit?.is_blocked) {
      console.log(`Rate limited: IP ${ipAddress}, email ${email}, retry after ${rateLimit.retry_after_seconds}s`)
      return new Response(
        JSON.stringify({ 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimit.retry_after_seconds,
          attemptsCount: rateLimit.attempts_count
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retry_after_seconds)
          } 
        }
      )
    }

    // Create anon client for actual auth
    const supabaseAnon = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    let authResult
    
    if (action === 'signin') {
      authResult = await supabaseAnon.auth.signInWithPassword({ email, password })
    } else if (action === 'signup') {
      authResult = await supabaseAnon.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName } : undefined
        }
      })
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data, error: authError } = authResult

    if (authError) {
      // Record failed attempt
      await supabaseAdmin.rpc('record_login_attempt', {
        p_ip_address: ipAddress,
        p_email: email,
        p_success: false
      })

      console.log(`Failed ${action} attempt for ${email} from ${ipAddress}: ${authError.message}`)

      // Get updated rate limit info
      const { data: updatedRateLimit } = await supabaseAdmin
        .rpc('check_rate_limit', {
          p_ip_address: ipAddress,
          p_email: email
        })

      const remaining = 5 - (updatedRateLimit?.[0]?.attempts_count || 0)

      return new Response(
        JSON.stringify({ 
          error: authError.message,
          attemptsRemaining: Math.max(0, remaining)
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Clear attempts on successful login
    await supabaseAdmin.rpc('clear_login_attempts', {
      p_ip_address: ipAddress,
      p_email: email
    })

    console.log(`Successful ${action} for ${email} from ${ipAddress}`)

    return new Response(
      JSON.stringify({ 
        session: data.session,
        user: data.user
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
