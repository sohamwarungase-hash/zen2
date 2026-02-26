import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
    persist(
        (set, get) => ({
            token: null,
            refreshToken: null,
            user: null,
            role: null,

            setAuth: async ({ token, refreshToken, user, role }) => {
                set({ token, refreshToken, user, role })
            },

            updateToken: (newToken) =>
                set({ token: newToken }),

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

export default useAuthStore
