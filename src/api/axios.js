import axios from 'axios'
import useAuthStore from '@/store/authStore'
import { toast } from '@/components/ui/use-toast'

import API_BASE_URL from '@/config/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor — attach JWT
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().clearAuth()
            toast({
                variant: 'destructive',
                title: 'Session Expired',
                description: 'Please log in again.',
            })
            window.location.href = '/login'
        } else {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Something went wrong'
            toast({
                variant: 'destructive',
                title: 'Error',
                description: message,
            })
        }
        return Promise.reject(error)
    }
)

export default api
