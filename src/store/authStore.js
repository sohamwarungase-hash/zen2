import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { onAuthStateChange } from '@supabase/supabase-js'

const useAuthStore = create(
    persist(
        (set, get) => ({
            token: null,
            refreshToken: null,
            user: null,
            role: null,

            setAuth: ({ token, refreshToken, user, role }) => {
                set({ token, refreshToken, user, role })
            },

            updateToken: (newToken) =>
                set({ token: newToken }),

setUser: (user) =>
                set({
                    user,
                    role: user?.role || get().role || null,
                }),

            /**
             * Fetch freshest profile from backend
             */
            fetchProfile: async () => {
                try {
                    const { getMe } = await import('@/api/authApi')
                    const user = await getMe()
                    set({ user, role: user.role })
                    return user
                } catch (error) {
                    console.error('Failed to fetch profile:', error)
                    return null
                }
            },

            clearAuth: () =>
                set({ token: null, refreshToken: null, user: null, role: null }),

            isAuthenticated: () => !!get().token,

            getHomeRoute: () => {
                const role = get().role
                if (role === 'CITIZEN') return '/citizen/home'
                if (role === 'ADMIN' || role === 'DEPT_OFFICER') return '/admin/dashboard'
                return '/login'
            },
        }),
        {
            name: 'zensolve-auth',
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                user: state.user,
                role: state.role,
            }),
        }
    )
)

/**
 * Listen for Supabase auth events (token refresh, sign out).
 * Call this once at app startup.
 */
export function initAuthListener() {
    let isInitialEvent = true

    const unsubscribe = onAuthStateChange((event, session) => {
        const store = useAuthStore.getState()

        if (event === 'TOKEN_REFRESHED' && session) {
            // Supabase auto-refreshed the token — sync to Zustand
            store.updateToken(session.access_token)
            // Also refresh profile data from backend
            store.fetchProfile()
        }

        if (event === 'SIGNED_OUT') {
            // Skip the initial SIGNED_OUT that Supabase fires on page load
            // when there is no active Supabase session (e.g. using mock tokens)
            if (isInitialEvent) {
                isInitialEvent = false
                return
            }
            store.clearAuth()
            window.location.href = '/login'
        }

        isInitialEvent = false
    })

    return unsubscribe
}

export default useAuthStore
