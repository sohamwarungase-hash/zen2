import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '[ZenSolve] Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    )
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false, // we handle auth via Express, not OAuth redirects
        },
    }
)

/**
 * After the Express backend returns a Supabase JWT on login,
 * call this to set the session in the Supabase client so it
 * can manage token refresh automatically.
 */
export async function setSupabaseSession(accessToken, refreshToken) {
    const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    })
    if (error) {
        console.error('[ZenSolve] Failed to set Supabase session:', error.message)
    }
    return { data, error }
}

/**
 * Get the current Supabase session (auto-refreshed).
 * Returns null if no active session.
 */
export async function getSupabaseSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
        console.error('[ZenSolve] Failed to get Supabase session:', error.message)
        return null
    }
    return session
}

/**
 * Listen for auth state changes (e.g. token refresh, sign out).
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
            callback(event, session)
        }
    )
    return subscription.unsubscribe
}
