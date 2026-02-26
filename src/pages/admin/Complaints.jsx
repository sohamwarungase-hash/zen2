import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllComplaints } from '@/api/complaintsApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { Eye, Loader2, AlertTriangle } from 'lucide-react'
import { STATUS_VARIANT, STATUS_LABEL, getPriorityVariant } from '@/components/ComplaintCard'

export default function Complaints() {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await getAllComplaints()
                setComplaints(Array.isArray(data) ? data : data?.complaints || [])
            } catch {
                setComplaints([])
            } finally {
                setLoading(false)
            }
        }
        fetchComplaints()
    }, [])

    const getSlaStatus = (complaint) => {
        if (!complaint.slaDeadline) return null
        const now = new Date()
        const deadline = new Date(complaint.slaDeadline)
        if (complaint.status === 'RESOLVED') return { label: 'Met', variant: 'green' }
        if (now > deadline) return { label: 'Breached', variant: 'red' }
        const hoursLeft = (deadline - now) / (1000 * 60 * 60)
        if (hoursLeft < 24) return { label: 'At Risk', variant: 'orange' }
        return { label: 'On Track', variant: 'green' }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight">
                        All Complaints
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and review all citizen complaints
                    </p>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Complaints List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-zenblue-400" />
                            </div>
                        ) : complaints.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-zenblue-200" />
                                <p>No complaints found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-zenblue-50/50">
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">ID</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Title</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Category</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Priority</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">SLA</th>
                                            <th className="text-right py-3 px-4 font-semibold text-zenblue-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.map((complaint) => {
                                            const sla = getSlaStatus(complaint)
                                            return (
                                                <tr
                                                    key={complaint._id || complaint.id}
                                                    className="border-b last:border-0 hover:bg-zenblue-50/30 transition-colors"
                                                >
                                                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                                                        {(complaint._id || complaint.id)?.slice(-6)?.toUpperCase() || '—'}
                                                    </td>
                                                    <td className="py-3 px-4 font-medium text-zenblue-800 max-w-[200px] truncate">
                                                        {complaint.title || 'Untitled'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="bg-zenblue-50 text-zenblue-700 px-2 py-0.5 rounded-full text-xs">
                                                            {complaint.category || '—'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge variant={getPriorityVariant(complaint.priority)}>
                                                            P{complaint.priority || '?'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge variant={STATUS_VARIANT[complaint.status] || 'gray'}>
                                                            {STATUS_LABEL[complaint.status] || complaint.status || '—'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {sla ? (
                                                            <Badge variant={sla.variant}>{sla.label}</Badge>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate(`/admin/complaints/${complaint._id || complaint.id}`)
                                                            }
                                                            className="text-zenaccent hover:text-zenaccent"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
