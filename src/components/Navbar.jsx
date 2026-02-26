import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import useNotificationStore from '@/store/notificationStore'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    FileText,
    Home,
    PlusCircle,
    List,
    LogOut,
    Menu,
    X,
    Shield,
    Building2,
    Users,
    AlertOctagon,
    Bell,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Complaints', icon: FileText },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/escalations', label: 'Escalations', icon: AlertOctagon },
]

const citizenLinks = [
    { to: '/citizen/home', label: 'Home', icon: Home },
    { to: '/citizen/report', label: 'Report Issue', icon: PlusCircle },
    { to: '/citizen/complaints', label: 'My Complaints', icon: List },
]

export default function Navbar() {
    const { role, user, clearAuth } = useAuthStore()
    const notifications = useNotificationStore((s) => s.notifications)
    const unreadCount = notifications.filter((n) => !n.read).length
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const links = role === 'CITIZEN' ? citizenLinks : adminLinks

    const handleLogout = () => {
        clearAuth()
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-zenblue-700 to-zenaccent flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-zenblue-800 tracking-tight">
                                ZenSolve
                            </span>
                            <span className="hidden sm:block text-[10px] text-muted-foreground -mt-1 leading-none">
                                Municipal Grievance System
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {links.map((link) => {
                            const isActive = location.pathname === link.to
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-zenblue-50 text-zenblue-800'
                                            : 'text-muted-foreground hover:text-zenblue-700 hover:bg-zenblue-50/50'
                                    )}
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <Link
                            to="/notifications"
                            className={cn(
                                'relative p-2 rounded-md transition-colors',
                                location.pathname === '/notifications'
                                    ? 'bg-zenblue-50 text-zenblue-800'
                                    : 'text-muted-foreground hover:text-zenblue-700 hover:bg-zenblue-50/50'
                            )}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 shadow-sm animate-in fade-in zoom-in duration-200">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* User info */}
                        <div className="hidden sm:flex items-center gap-2 ml-1">
                            <div className="h-8 w-8 rounded-full bg-zenblue-100 flex items-center justify-center text-sm font-semibold text-zenblue-700">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-zenblue-800 leading-none">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-[10px] text-muted-foreground capitalize">
                                    {role?.toLowerCase()?.replace('_', ' ') || 'citizen'}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-muted-foreground hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline ml-1">Logout</span>
                        </Button>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden p-2 rounded-md hover:bg-zenblue-50"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <nav className="md:hidden border-t py-3 space-y-1">
                        {links.map((link) => {
                            const isActive = location.pathname === link.to
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-zenblue-50 text-zenblue-800'
                                            : 'text-muted-foreground hover:text-zenblue-700 hover:bg-zenblue-50/50'
                                    )}
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            )
                        })}
                        <Link
                            to="/notifications"
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                location.pathname === '/notifications'
                                    ? 'bg-zenblue-50 text-zenblue-800'
                                    : 'text-muted-foreground hover:text-zenblue-700 hover:bg-zenblue-50/50'
                            )}
                        >
                            <Bell className="h-4 w-4" />
                            Notifications
                            {unreadCount > 0 && (
                                <Badge className="ml-auto bg-red-500 text-white text-[10px] py-0 px-1.5">
                                    {unreadCount}
                                </Badge>
                            )}
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    )
}
