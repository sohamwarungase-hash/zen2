import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

const ROLE_ROUTES = {
    CITIZEN: '/citizen',
    ADMIN: '/admin',
    DEPT_OFFICER: '/admin',
}

export default function AuthGuard({ children, allowedRoles }) {
    const { token, role } = useAuthStore()
    const location = useLocation()

    // No token → redirect to login
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Wrong role → redirect to correct home
    if (allowedRoles && !allowedRoles.includes(role)) {
        const homeRoute = ROLE_ROUTES[role] || '/login'
        const defaultHome =
            role === 'CITIZEN' ? '/citizen/home' : '/admin/dashboard'
        return <Navigate to={defaultHome} replace />
    }

    return children
}
