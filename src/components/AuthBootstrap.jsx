import { useEffect } from 'react'
import { getCurrentUser } from '@/api/authApi'
import useAuthStore from '@/store/authStore'

export default function AuthBootstrap({ children }) {
    const token = useAuthStore((state) => state.token)
    const setUser = useAuthStore((state) => state.setUser)
    const clearAuth = useAuthStore((state) => state.clearAuth)

    useEffect(() => {
        const syncAuth = async () => {
            if (!token) return

            try {
                const user = await getCurrentUser()
                setUser(user)
            } catch {
                clearAuth()
            }
        }

        syncAuth()
    }, [token, setUser, clearAuth])

    return children
}
