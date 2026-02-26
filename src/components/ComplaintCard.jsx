import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const STATUS_VARIANT = {
    SUBMITTED: 'blue',
    ASSIGNED: 'purple',
    IN_PROGRESS: 'yellow',
    RESOLVED: 'green',
    ESCALATED: 'red',
}

const STATUS_LABEL = {
    SUBMITTED: 'Submitted',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    ESCALATED: 'Escalated',
}

function getPriorityVariant(priority) {
    if (priority >= 9) return 'red'
    if (priority >= 7) return 'orange'
    if (priority >= 4) return 'yellow'
    return 'gray'
}

export default function ComplaintCard({ complaint, showViewButton = true, basePath = '/citizen' }) {
    const navigate = useNavigate()

    const handleClick = () => {
        const id = complaint._id || complaint.id
        if (id) {
            navigate(`${basePath}/complaints/${id}`)
        }
    }

    return (
        <Card
            className="group cursor-pointer hover:border-zenblue-200 hover:shadow-md transition-all duration-200"
            onClick={handleClick}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-zenblue-800 truncate">
                                {complaint.title || 'Untitled Complaint'}
                            </h4>
                            <Badge variant={STATUS_VARIANT[complaint.status] || 'gray'}>
                                {STATUS_LABEL[complaint.status] || complaint.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {complaint.description || 'No description provided'}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {complaint.category && (
                                <span className="bg-zenblue-50 text-zenblue-700 px-2 py-0.5 rounded-full">
                                    {complaint.category}
                                </span>
                            )}
                            {complaint.priority && (
                                <Badge variant={getPriorityVariant(complaint.priority)} className="text-[10px]">
                                    P{complaint.priority}
                                </Badge>
                            )}
                            {complaint.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {complaint.location}
                                </span>
                            )}
                            {complaint.createdAt && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                    {complaint.photo && (
                        <img
                            src={complaint.photo}
                            alt="Complaint"
                            className="h-16 w-16 rounded-md object-cover flex-shrink-0 border"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export { STATUS_VARIANT, STATUS_LABEL, getPriorityVariant }
