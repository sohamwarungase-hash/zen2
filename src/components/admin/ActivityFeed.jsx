import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, ArrowUpCircle, CheckCircle, Clock, FileText, UserCheck } from 'lucide-react'

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

export default function ActivityFeed({ activities = [] }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-zenblue-800">Recent Activity</CardTitle>
                        <p className="text-xs text-muted-foreground">Latest status changes across all complaints</p>
                    </div>
                    <Badge variant="blue" className="text-[10px]">Live</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-0">
                    {activities.map((activity, index) => {
                        const StatusIcon = ICON_MAP[activity.status] || AlertCircle
                        const variant = VARIANT_MAP[activity.status] || 'gray'
                        const isLast = index === activities.length - 1

                        return (
                            <div key={activity.id} className="flex gap-3 group">
                                <div className="flex flex-col items-center">
                                    <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-zenblue-100 bg-zenblue-50">
                                        <StatusIcon className="h-3.5 w-3.5 text-zenblue-700" />
                                    </div>
                                    {!isLast && <div className="w-px flex-1 bg-zenblue-100 min-h-[20px]" />}
                                </div>

                                <div className="pb-4 flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-zenblue-800 truncate">{activity.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-muted-foreground">{activity.complaintId}</span>
                                                <span className="text-xs text-muted-foreground">·</span>
                                                <Badge variant={variant} className="text-[10px] py-0">{LABEL_MAP[activity.status] || activity.status}</Badge>
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">by {activity.user}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
