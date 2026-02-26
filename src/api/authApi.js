import { supabase } from '@/lib/supabase'

export const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw new Error(error.message)
    }

    const { session, user } = data

    return {
        token: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
        user,
    }
}

export const registerUser = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                role: 'CITIZEN',
            },
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    const { session, user } = data

    return {
        token: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
        user,
    }
}
