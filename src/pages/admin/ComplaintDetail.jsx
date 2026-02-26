import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getComplaintById, updateComplaintStatus } from '@/api/complaintsApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import Navbar from '@/components/Navbar'
import { STATUS_VARIANT, STATUS_LABEL, getPriorityVariant } from '@/components/ComplaintCard'
import {
    Loader2,
    MapPin,
    Calendar,
    Tag,
    Brain,
    Building2,
    AlertTriangle,
    ArrowLeft,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const STATUS_OPTIONS = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED']

export default function ComplaintDetail() {
    const { id } = useParams()
    const [complaint, setComplaint] = useState(null)
    const [loading, setLoading] = useState(true)
    const [statusLoading, setStatusLoading] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const data = await getComplaintById(id)
                const c = data?.complaint || data
                setComplaint(c)
                setNewStatus(c?.status || '')
            } catch {
                // handled by interceptor
            } finally {
                setLoading(false)
            }
        }
        fetchComplaint()
    }, [id])

    const handleStatusUpdate = async () => {
        if (!newStatus || newStatus === complaint.status) return
        setStatusLoading(true)
        try {
            await updateComplaintStatus(id, newStatus)
            setComplaint((prev) => ({ ...prev, status: newStatus }))
            toast({
                variant: 'success',
                title: 'Status Updated',
                description: `Complaint status changed to ${STATUS_LABEL[newStatus]}.`,
            })
        } catch {
            // handled by interceptor
        } finally {
            setStatusLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-10 w-10 animate-spin text-zenblue-400" />
                </div>
            </div>
        )
    }

    if (!complaint) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto text-zenblue-200 mb-4" />
                    <p className="text-muted-foreground">Complaint not found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-6 text-muted-foreground"
                    onClick={() => navigate('/admin/complaints')}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Complaints
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl text-zenblue-800">
                                            {complaint.title || 'Untitled Complaint'}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant={STATUS_VARIANT[complaint.status] || 'gray'}>
                                                {STATUS_LABEL[complaint.status] || complaint.status}
                                            </Badge>
                                            {complaint.priority && (
                                                <Badge variant={getPriorityVariant(complaint.priority)}>
                                                    Priority {complaint.priority}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs text-muted-foreground bg-zenblue-50 px-2 py-1 rounded">
                                        #{(complaint._id || complaint.id)?.slice(-6)?.toUpperCase()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Photo */}
                                {(complaint.photo || complaint.imageUrl) && (
                                    <div className="rounded-lg overflow-hidden border">
                                        <img
                                            src={complaint.photo || complaint.imageUrl}
                                            alt="Complaint photograph"
                                            className="w-full max-h-96 object-cover"
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-semibold text-zenblue-700 mb-2">Description</h3>
                                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                        {complaint.description || 'No description provided.'}
                                    </p>
                                </div>

                                {/* Meta */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t">
                                    {complaint.category && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Tag className="h-4 w-4 text-zenblue-400" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Category</p>
                                                <p className="font-medium text-zenblue-800">{complaint.category}</p>
                                            </div>
                                        </div>
                                    )}
                                    {(complaint.location || complaint.address) && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-zenblue-400" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Location</p>
                                                <p className="font-medium text-zenblue-800">{complaint.location || complaint.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {complaint.createdAt && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-zenblue-400" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Filed On</p>
                                                <p className="font-medium text-zenblue-800">
                                                    {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* AI Classification Panel */}
                        <Card className="border-zenblue-100">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-zenaccent" />
                                    AI Classification
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Auto-Detected Category</p>
                                    <p className="text-sm font-medium text-zenblue-800">
                                        {complaint.aiCategory || complaint.category || '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Predicted Priority</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Badge variant={getPriorityVariant(complaint.aiPriority || complaint.priority)}>
                                            P{complaint.aiPriority || complaint.priority || '?'}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Assigned Department</p>
                                    <p className="text-sm font-medium text-zenblue-800 flex items-center gap-1">
                                        <Building2 className="h-3.5 w-3.5" />
                                        {complaint.aiDepartment || complaint.department || '—'}
                                    </p>
                                </div>
                                {complaint.aiReasoning && (
                                    <div className="pt-2 border-t">
                                        <p className="text-xs text-muted-foreground mb-1">Gemini Reasoning</p>
                                        <p className="text-xs text-foreground leading-relaxed bg-zenblue-50 rounded-md p-3">
                                            {complaint.aiReasoning}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Update */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Update Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {STATUS_LABEL[s]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleStatusUpdate}
                                    className="w-full bg-zenblue-800 hover:bg-zenblue-700"
                                    disabled={statusLoading || newStatus === complaint.status}
                                >
                                    {statusLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Status'
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
