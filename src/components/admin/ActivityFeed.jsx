import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    CheckCircle,
    AlertCircle,
    ArrowUpCircle,
    UserCheck,
    Clock,
    FileText,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const ICON_MAP = {
    SUBMITTED: FileText,
    ASSIGNED: UserCheck,
    IN_PROGRESS: Clock,
    RESOLVED: CheckCircle,
    ESCALATED: ArrowUpCircle,
}

const VARIANT_MAP = {
    SUBMITTED: 'blue',
    ASSIGNED: 'purple',
    IN_PROGRESS: 'yellow',
    RESOLVED: 'green',
    ESCALATED: 'red',
}

const LABEL_MAP = {
    SUBMITTED: 'Submitted',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    ESCALATED: 'Escalated',
}

const MOCK_ACTIVITY = [
    {
        id: 1,
        complaintId: 'GRV-1042',
        title: 'Pothole on MG Road near Central Mall',
        status: 'RESOLVED',
        user: 'Officer Mehta',
        timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 min ago
    },
    {
        id: 2,
        complaintId: 'GRV-1089',
        title: 'Water leakage at Sector 22 pipeline junction',
        status: 'ASSIGNED',
        user: 'Admin',
        timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 min ago
    },
    {
        id: 3,
        complaintId: 'GRV-1091',
        title: 'Broken streetlight near Gandhi Park',
        status: 'IN_PROGRESS',
        user: 'Officer Sharma',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hr ago
    },
    {
        id: 4,
        complaintId: 'GRV-1095',
        title: 'Garbage not collected in Ward 14 for 3 days',
        status: 'ESCALATED',
        user: 'System (SLA)',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hr ago
    },
    {
        id: 5,
        complaintId: 'GRV-1098',
        title: 'Drainage overflow on Lake View Road',
        status: 'SUBMITTED',
        user: 'Citizen Priya R.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hr ago
    },
    {
        id: 6,
        complaintId: 'GRV-1101',
        title: 'Open manhole cover on Station Road',
        status: 'ASSIGNED',
        user: 'Admin',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hr ago
    },
    {
        id: 7,
        complaintId: 'GRV-1103',
        title: 'Illegal dumping at construction site, Jayanagar',
        status: 'RESOLVED',
        user: 'Officer Patil',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hr ago
    },
    {
        id: 8,
        complaintId: 'GRV-1107',
        title: 'No water supply in Block C apartments',
        status: 'IN_PROGRESS',
        user: 'Officer Reddy',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hr ago
    },
]

export default function ActivityFeed() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-zenblue-800">
                            Recent Activity
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Latest status changes across all complaints</p>
                    </div>
                    <Badge variant="blue" className="text-[10px]">
                        Live
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-0">
                    {MOCK_ACTIVITY.map((activity, index) => {
                        const StatusIcon = ICON_MAP[activity.status] || AlertCircle
                        const variant = VARIANT_MAP[activity.status] || 'gray'
                        const isLast = index === MOCK_ACTIVITY.length - 1

                        return (
                            <div key={activity.id} className="flex gap-3 group">
                                {/* Timeline line + dot */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors
                                            ${activity.status === 'RESOLVED' ? 'border-green-200 bg-green-50' : ''}
                                            ${activity.status === 'ESCALATED' ? 'border-red-200 bg-red-50' : ''}
                                            ${activity.status === 'IN_PROGRESS' ? 'border-yellow-200 bg-yellow-50' : ''}
                                            ${activity.status === 'ASSIGNED' ? 'border-purple-200 bg-purple-50' : ''}
                                            ${activity.status === 'SUBMITTED' ? 'border-blue-200 bg-blue-50' : ''}
                                        `}
                                    >
                                        <StatusIcon className={`h-3.5 w-3.5
                                            ${activity.status === 'RESOLVED' ? 'text-green-600' : ''}
                                            ${activity.status === 'ESCALATED' ? 'text-red-600' : ''}
                                            ${activity.status === 'IN_PROGRESS' ? 'text-yellow-600' : ''}
                                            ${activity.status === 'ASSIGNED' ? 'text-purple-600' : ''}
                                            ${activity.status === 'SUBMITTED' ? 'text-blue-600' : ''}
                                        `} />
                                    </div>
                                    {!isLast && (
                                        <div className="w-px flex-1 bg-zenblue-100 min-h-[20px]" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pb-4 flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-zenblue-800 truncate">
                                                {activity.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-muted-foreground">
                                                    {activity.complaintId}
                                                </span>
                                                <span className="text-xs text-muted-foreground">·</span>
                                                <Badge variant={variant} className="text-[10px] py-0">
                                                    {LABEL_MAP[activity.status]}
                                                </Badge>
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        by {activity.user}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
