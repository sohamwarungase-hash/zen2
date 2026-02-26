import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FeedbackForm from '@/components/citizen/FeedbackForm'
import Navbar from '@/components/Navbar'
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Tag,
    Brain,
    Building2,
    Clock,
    CheckCircle,
    AlertCircle,
    UserCheck,
    ArrowUpCircle,
    FileText,
    Image as ImageIcon,
} from 'lucide-react'

const STATUS_CONFIG = {
    SUBMITTED: { label: 'Submitted', variant: 'blue', icon: FileText, color: 'blue' },
    ASSIGNED: { label: 'Assigned', variant: 'purple', icon: UserCheck, color: 'purple' },
    IN_PROGRESS: { label: 'In Progress', variant: 'yellow', icon: Clock, color: 'yellow' },
    RESOLVED: { label: 'Resolved', variant: 'green', icon: CheckCircle, color: 'green' },
    ESCALATED: { label: 'Escalated', variant: 'red', icon: ArrowUpCircle, color: 'red' },
}

const STATUS_ORDER = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']

// Hardcoded complaint data for demo
const MOCK_COMPLAINTS = {
    '1': {
        id: '1',
        complaintId: 'GRV-1042',
        title: 'Large pothole on MG Road causing traffic hazard',
        description:
            'There is a large pothole approximately 2 feet wide and 6 inches deep on MG Road near Central Mall. It has been causing traffic disruption and is a safety hazard for two-wheelers and pedestrians. The pothole appeared after the recent heavy rains and has been growing in size. Multiple accidents have been reported at this spot in the past week.',
        category: 'Roads & Potholes',
        status: 'IN_PROGRESS',
        priority: 8,
        location: 'MG Road, near Central Mall',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        photo: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop',
        createdAt: '2026-02-20T10:30:00Z',
        updatedAt: '2026-02-24T14:15:00Z',
        assignedDepartment: 'Roads & Transport',
        assignedOfficer: 'Officer Mehta',
        aiClassification: {
            category: 'Roads & Potholes',
            priority: 8,
            department: 'Roads & Transport',
            confidence: 0.94,
            summary: 'High-priority road infrastructure damage. Pothole on primary arterial road with reported accidents. Immediate repair recommended.',
        },
        timeline: [
            { status: 'SUBMITTED', timestamp: '2026-02-20T10:30:00Z', note: 'Complaint filed by citizen' },
            { status: 'ASSIGNED', timestamp: '2026-02-21T09:15:00Z', note: 'Assigned to Roads & Transport — Officer Mehta' },
            { status: 'IN_PROGRESS', timestamp: '2026-02-22T11:00:00Z', note: 'Repair crew dispatched to location' },
        ],
        feedback: null,
    },
    '2': {
        id: '2',
        complaintId: 'GRV-1055',
        title: 'No water supply in Block C apartments for 2 days',
        description:
            'The entire Block C of Sunshine Apartments has not received water supply for the past 2 days. This is affecting 50+ families. The issue seems to be with the main pipeline valve near the community park. We have contacted the local water board office but received no response.',
        category: 'Water Supply',
        status: 'RESOLVED',
        priority: 9,
        location: 'Sunshine Apartments, Block C, Sector 22',
        coordinates: { lat: 12.9352, lng: 77.6245 },
        photo: null,
        createdAt: '2026-02-18T08:00:00Z',
        updatedAt: '2026-02-23T16:45:00Z',
        assignedDepartment: 'Water Supply',
        assignedOfficer: 'Officer Reddy',
        aiClassification: {
            category: 'Water Supply',
            priority: 9,
            department: 'Water Supply',
            confidence: 0.97,
            summary: 'Critical water supply disruption affecting residential complex. Pipeline valve issue suspected. High priority due to number of affected households.',
        },
        timeline: [
            { status: 'SUBMITTED', timestamp: '2026-02-18T08:00:00Z', note: 'Complaint filed by citizen' },
            { status: 'ASSIGNED', timestamp: '2026-02-18T10:30:00Z', note: 'Assigned to Water Supply — Officer Reddy' },
            { status: 'IN_PROGRESS', timestamp: '2026-02-19T09:00:00Z', note: 'Inspection team sent to check pipeline' },
            { status: 'RESOLVED', timestamp: '2026-02-23T16:45:00Z', note: 'Main valve repaired, water supply restored' },
        ],
        feedback: {
            rating: 4,
            comment: 'Issue was resolved but took a bit long. Glad it is fixed now.',
        },
    },
    '3': {
        id: '3',
        complaintId: 'GRV-1067',
        title: 'Broken streetlight near Gandhi Park entrance',
        description:
            'The streetlight at the main entrance of Gandhi Park has been broken for over a week. The area becomes very dark after 6 PM making it unsafe for evening walkers and nearby residents. The light pole itself seems intact but the bulb/fixture needs replacement.',
        category: 'Street Lighting',
        status: 'ASSIGNED',
        priority: 5,
        location: 'Gandhi Park Main Entrance, Jayanagar',
        coordinates: { lat: 12.9250, lng: 77.5838 },
        photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
        createdAt: '2026-02-22T18:45:00Z',
        updatedAt: '2026-02-24T10:00:00Z',
        assignedDepartment: 'Electrical',
        assignedOfficer: 'Officer Sharma',
        aiClassification: {
            category: 'Street Lighting',
            priority: 5,
            department: 'Electrical',
            confidence: 0.91,
            summary: 'Non-functional streetlight near public park. Moderate priority — safety concern for evening hours.',
        },
        timeline: [
            { status: 'SUBMITTED', timestamp: '2026-02-22T18:45:00Z', note: 'Complaint filed by citizen' },
            { status: 'ASSIGNED', timestamp: '2026-02-24T10:00:00Z', note: 'Assigned to Electrical — Officer Sharma' },
        ],
        feedback: null,
    },
}

function getPriorityLabel(priority) {
    if (priority >= 9) return { text: 'Critical', variant: 'red' }
    if (priority >= 7) return { text: 'High', variant: 'orange' }
    if (priority >= 4) return { text: 'Medium', variant: 'yellow' }
    return { text: 'Low', variant: 'gray' }
}

export default function CitizenComplaintDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [showFullImage, setShowFullImage] = useState(false)

    // Get complaint data from mock
    const complaint = MOCK_COMPLAINTS[id]

    if (!complaint) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <AlertCircle className="h-12 w-12 mx-auto text-zenblue-200 mb-4" />
                        <h2 className="text-xl font-semibold text-zenblue-800 mb-2">Complaint Not Found</h2>
                        <p className="text-muted-foreground mb-4">
                            The complaint you're looking for doesn't exist or you don't have access.
                        </p>
                        <Button onClick={() => navigate('/citizen/complaints')} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to My Complaints
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    const statusConfig = STATUS_CONFIG[complaint.status]
    const priorityInfo = getPriorityLabel(complaint.priority)
    const currentStatusIndex = STATUS_ORDER.indexOf(complaint.status)
    const isEscalated = complaint.status === 'ESCALATED'
    const isResolved = complaint.status === 'RESOLVED'

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/citizen/complaints')}
                    className="mb-4 text-muted-foreground hover:text-zenblue-700 -ml-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to My Complaints
                </Button>

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-xs font-mono text-muted-foreground bg-zenblue-50 px-2 py-0.5 rounded">
                                    {complaint.complaintId}
                                </span>
                                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                                <Badge variant={priorityInfo.variant}>Priority: {priorityInfo.text}</Badge>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-zenblue-800 tracking-tight">
                                {complaint.title}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column — Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Photo */}
                        {complaint.photo && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="relative group">
                                        <img
                                            src={complaint.photo}
                                            alt="Complaint photo"
                                            className="w-full h-64 sm:h-80 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.01]"
                                            onClick={() => setShowFullImage(true)}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                                            <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Description */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-zenblue-800">
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {complaint.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Details Grid */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-zenblue-800">
                                    Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Tag className="h-4 w-4 text-zenblue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Category</p>
                                            <p className="text-sm font-medium text-zenblue-800">{complaint.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-zenblue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Location</p>
                                            <p className="text-sm font-medium text-zenblue-800">{complaint.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 text-zenblue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Filed On</p>
                                            <p className="text-sm font-medium text-zenblue-800">
                                                {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-4 w-4 text-zenblue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Assigned Department</p>
                                            <p className="text-sm font-medium text-zenblue-800">
                                                {complaint.assignedDepartment || 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Classification */}
                        {complaint.aiClassification && (
                            <Card className="border-zenaccent/20 bg-gradient-to-br from-blue-50/50 to-purple-50/30">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-zenaccent to-purple-500 flex items-center justify-center">
                                            <Brain className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-semibold text-zenblue-800">
                                                AI Analysis
                                            </CardTitle>
                                            <p className="text-[10px] text-muted-foreground">
                                                Powered by Gemini AI · {Math.round(complaint.aiClassification.confidence * 100)}% confidence
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        {complaint.aiClassification.summary}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="blue" className="text-xs">
                                            {complaint.aiClassification.category}
                                        </Badge>
                                        <Badge variant={getPriorityLabel(complaint.aiClassification.priority).variant} className="text-xs">
                                            Priority {complaint.aiClassification.priority}/10
                                        </Badge>
                                        <Badge variant="purple" className="text-xs">
                                            → {complaint.aiClassification.department}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column — Timeline + Feedback */}
                    <div className="space-y-6">
                        {/* Status Stepper */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-zenblue-800">
                                    Status Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-0">
                                    {complaint.timeline.map((entry, index) => {
                                        const config = STATUS_CONFIG[entry.status]
                                        const StatusIcon = config.icon
                                        const isLastEntry = index === complaint.timeline.length - 1

                                        return (
                                            <div key={index} className="flex gap-3">
                                                {/* Dot & Line */}
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border-2
                                                            ${config.color === 'blue' ? 'border-blue-200 bg-blue-50' : ''}
                                                            ${config.color === 'purple' ? 'border-purple-200 bg-purple-50' : ''}
                                                            ${config.color === 'yellow' ? 'border-yellow-200 bg-yellow-50' : ''}
                                                            ${config.color === 'green' ? 'border-green-200 bg-green-50' : ''}
                                                            ${config.color === 'red' ? 'border-red-200 bg-red-50' : ''}
                                                        `}
                                                    >
                                                        <StatusIcon className={`h-3.5 w-3.5
                                                            ${config.color === 'blue' ? 'text-blue-600' : ''}
                                                            ${config.color === 'purple' ? 'text-purple-600' : ''}
                                                            ${config.color === 'yellow' ? 'text-yellow-600' : ''}
                                                            ${config.color === 'green' ? 'text-green-600' : ''}
                                                            ${config.color === 'red' ? 'text-red-600' : ''}
                                                        `} />
                                                    </div>
                                                    {!isLastEntry && (
                                                        <div className="w-px flex-1 bg-zenblue-100 min-h-[24px]" />
                                                    )}
                                                </div>
                                                {/* Content */}
                                                <div className="pb-5 flex-1">
                                                    <p className="text-sm font-medium text-zenblue-800">
                                                        {config.label}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {entry.note}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground mt-1">
                                                        {new Date(entry.timestamp).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Pending steps */}
                                    {!isResolved && !isEscalated && STATUS_ORDER.slice(currentStatusIndex + 1).map((status, index) => {
                                        const config = STATUS_CONFIG[status]
                                        const StatusIcon = config.icon
                                        const isLast = index === STATUS_ORDER.slice(currentStatusIndex + 1).length - 1

                                        return (
                                            <div key={status} className="flex gap-3 opacity-40">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-dashed border-gray-200 bg-gray-50">
                                                        <StatusIcon className="h-3.5 w-3.5 text-gray-400" />
                                                    </div>
                                                    {!isLast && (
                                                        <div className="w-px flex-1 border-l border-dashed border-gray-200 min-h-[24px]" />
                                                    )}
                                                </div>
                                                <div className="pb-5">
                                                    <p className="text-sm font-medium text-gray-400">{config.label}</p>
                                                    <p className="text-xs text-gray-300 mt-0.5">Pending</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Feedback Section (only for RESOLVED) */}
                        {isResolved && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold text-zenblue-800">
                                        Your Feedback
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        Help us improve by rating this resolution
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <FeedbackForm
                                        complaintId={complaint.id}
                                        existingFeedback={complaint.feedback}
                                        onSubmit={(feedback) => {
                                            console.log('Feedback submitted:', feedback)
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Escalated Warning */}
                        {isEscalated && (
                            <Card className="border-red-200 bg-red-50/50">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <ArrowUpCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800">
                                                Complaint Escalated
                                            </p>
                                            <p className="text-xs text-red-600 mt-1">
                                                This complaint has been escalated due to SLA breach. A senior officer has been assigned for expedited resolution.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            {/* Full Image Modal */}
            {showFullImage && complaint.photo && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setShowFullImage(false)}
                >
                    <img
                        src={complaint.photo}
                        alt="Complaint photo full view"
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <button
                        onClick={() => setShowFullImage(false)}
                        className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full h-10 w-10 flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    )
}
