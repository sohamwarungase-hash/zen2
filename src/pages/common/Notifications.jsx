import { useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import useNotificationStore from '@/store/notificationStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
    Bell,
    CheckCheck,
    Trash2,
    AlertTriangle,
    FileText,
    UserCheck,
    Clock,
    ArrowUpCircle,
    X,
} from 'lucide-react'

const TYPE_CONFIG = {
    STATUS_UPDATE: {
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'blue',
        label: 'Status Update',
    },
    ASSIGNMENT: {
        icon: UserCheck,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        badge: 'purple',
        label: 'Assignment',
    },
    SLA_BREACH: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        badge: 'red',
        label: 'SLA Alert',
    },
    NEW_COMPLAINT: {
        icon: FileText,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        badge: 'green',
        label: 'New Complaint',
    },
}

const FILTER_OPTIONS = [
    { value: 'ALL', label: 'All' },
    { value: 'UNREAD', label: 'Unread' },
    { value: 'STATUS_UPDATE', label: 'Status Updates' },
    { value: 'ASSIGNMENT', label: 'Assignments' },
    { value: 'SLA_BREACH', label: 'SLA Alerts' },
    { value: 'NEW_COMPLAINT', label: 'New Complaints' },
]

export default function Notifications() {
    const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } =
        useNotificationStore()
    const [filter, setFilter] = useState('ALL')

    const unreadCount = notifications.filter((n) => !n.read).length

    const filtered = useMemo(() => {
        if (filter === 'ALL') return notifications
        if (filter === 'UNREAD') return notifications.filter((n) => !n.read)
        return notifications.filter((n) => n.type === filter)
    }, [notifications, filter])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight flex items-center gap-2">
                            <Bell className="h-6 w-6 text-zenaccent" />
                            Notifications
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {unreadCount > 0
                                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                : 'All caught up!'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-xs"
                            >
                                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                                Mark all read
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (window.confirm('Clear all notifications?')) clearAll()
                                }}
                                className="text-xs text-muted-foreground hover:text-red-600"
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Clear all
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {FILTER_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                                filter === opt.value
                                    ? 'bg-zenblue-800 text-white border-zenblue-800'
                                    : 'bg-white text-muted-foreground border-zenblue-100 hover:bg-zenblue-50 hover:text-zenblue-700'
                            )}
                        >
                            {opt.label}
                            {opt.value === 'UNREAD' && unreadCount > 0 && (
                                <span className="ml-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notification List */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            {filter === 'ALL' ? 'All Notifications' : FILTER_OPTIONS.find((f) => f.value === filter)?.label}
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({filtered.length})
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filtered.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="h-10 w-10 mx-auto text-zenblue-200 mb-3" />
                                <p className="text-muted-foreground text-sm">No notifications to show.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filtered.map((notif) => {
                                    const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.STATUS_UPDATE
                                    const NotifIcon = config.icon

                                    return (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                'flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group cursor-pointer',
                                                notif.read
                                                    ? 'bg-white hover:bg-gray-50'
                                                    : 'bg-zenblue-50/50 hover:bg-zenblue-50 border-l-2 border-l-zenaccent'
                                            )}
                                            onClick={() => {
                                                if (!notif.read) markAsRead(notif.id)
                                            }}
                                        >
                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    'h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0',
                                                    config.bg
                                                )}
                                            >
                                                <NotifIcon className={cn('h-4 w-4', config.color)} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <p
                                                                className={cn(
                                                                    'text-sm truncate',
                                                                    notif.read
                                                                        ? 'font-medium text-zenblue-700'
                                                                        : 'font-semibold text-zenblue-800'
                                                                )}
                                                            >
                                                                {notif.title}
                                                            </p>
                                                            {!notif.read && (
                                                                <div className="h-2 w-2 rounded-full bg-zenaccent flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {notif.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <Badge variant={config.badge} className="text-[10px] py-0">
                                                                {config.label}
                                                            </Badge>
                                                            <span className="text-[11px] text-muted-foreground">
                                                                {formatDistanceToNow(new Date(notif.timestamp), {
                                                                    addSuffix: true,
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Remove button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            removeNotification(notif.id)
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
