import api from './axios'

export const loginUser = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    const { user, session } = response.data

    return {
        token: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
        user,
    }
}

export const registerUser = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password })
    const { user, session } = response.data

    return {
        token: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
        user,
    }
}

export const getCurrentUser = async () => {
    const response = await api.get('/api/auth/me')
    return response.data
}
