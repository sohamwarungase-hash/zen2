import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthGuard from '@/components/AuthGuard'

// Auth pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Admin pages
import Dashboard from '@/pages/admin/Dashboard'
import AdminComplaints from '@/pages/admin/Complaints'
import ComplaintDetail from '@/pages/admin/ComplaintDetail'
import Departments from '@/pages/admin/Departments'
import Users from '@/pages/admin/Users'
import Escalations from '@/pages/admin/Escalations'

// Citizen pages
import CitizenHome from '@/pages/citizen/Home'
import Report from '@/pages/citizen/Report'
import MyComplaints from '@/pages/citizen/MyComplaints'
import CitizenComplaintDetail from '@/pages/citizen/ComplaintDetail'

// Common pages
import Notifications from '@/pages/common/Notifications'

const router = createBrowserRouter([
    // Public routes
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },

    // Admin routes
    {
        path: '/admin/dashboard',
        element: (
            <AuthGuard allowedRoles={['ADMIN', 'DEPT_OFFICER']}>
                <Dashboard />
            </AuthGuard>
        ),
    },
    {
        path: '/admin/complaints',
        element: (
            <AuthGuard allowedRoles={['ADMIN', 'DEPT_OFFICER']}>
                <AdminComplaints />
            </AuthGuard>
        ),
    },
    {
        path: '/admin/complaints/:id',
        element: (
            <AuthGuard allowedRoles={['ADMIN', 'DEPT_OFFICER']}>
                <ComplaintDetail />
            </AuthGuard>
        ),
    },
    {
        path: '/admin/departments',
        element: (
            <AuthGuard allowedRoles={['ADMIN', 'DEPT_OFFICER']}>
                <Departments />
            </AuthGuard>
        ),
    },
    {
        path: '/admin/users',
        element: (
            <AuthGuard allowedRoles={['ADMIN', 'DEPT_OFFICER']}>
                <Users />
            </AuthGuard>
        ),
    },
    {
        path: '/admin/escalations',
        element: (
            <AuthGuard allowedRoles={['ADMIN', 'DEPT_OFFICER']}>
                <Escalations />
            </AuthGuard>
        ),
    },

    // Citizen routes
    {
        path: '/citizen/home',
        element: (
            <AuthGuard allowedRoles={['CITIZEN']}>
                <CitizenHome />
            </AuthGuard>
        ),
    },
    {
        path: '/citizen/report',
        element: (
            <AuthGuard allowedRoles={['CITIZEN']}>
                <Report />
            </AuthGuard>
        ),
    },
    {
        path: '/citizen/complaints',
        element: (
            <AuthGuard allowedRoles={['CITIZEN']}>
                <MyComplaints />
            </AuthGuard>
        ),
    },
    {
        path: '/citizen/complaints/:id',
        element: (
            <AuthGuard allowedRoles={['CITIZEN']}>
                <CitizenComplaintDetail />
            </AuthGuard>
        ),
    },

    // Shared routes
    {
        path: '/notifications',
        element: (
            <AuthGuard allowedRoles={['CITIZEN', 'ADMIN', 'DEPT_OFFICER']}>
                <Notifications />
            </AuthGuard>
        ),
    },

    // Fallback
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
])

export default router
