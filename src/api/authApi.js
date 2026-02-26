import api from './axios'

/**
 * Login via Express Backend
 * The backend verifies with Supabase and then syncs/fetches the user from Prisma.
 */
export const loginUser = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    const { user, session } = response.data

    return {
        token: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
        user,
        role: user.role, // Prisma role
    }
}

/**
 * Register via Express Backend
 * The backend creates the Supabase user AND the Prisma user record.
 */
export const registerUser = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password })
    const { user, session } = response.data

    return {
        token: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
        user,
        role: user.role, // Prisma role
    }
}

/**
 * Fetch current user from backend (to get latest points/role)
 */
export const getMe = async () => {
    const response = await api.get('/api/auth/me')
    return response.data
}
