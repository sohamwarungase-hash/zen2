import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { getAllComplaints } from '@/api/complaintsApi'
import { getDepartments } from '@/api/departmentsApi'
import { STATUS_LABEL, STATUS_VARIANT, getPriorityVariant } from '@/components/ComplaintCard'
import { AlertOctagon, ArrowRightLeft, Clock, Loader2 } from 'lucide-react'

const LOCAL_ESCALATION_ASSIGNMENTS_KEY = 'zensolve_escalation_assignments_v1'

function safeJsonParse(value, fallback) {
    try {
        return JSON.parse(value)
    } catch {
        return fallback
    }
}

function loadAssignments() {
    return safeJsonParse(localStorage.getItem(LOCAL_ESCALATION_ASSIGNMENTS_KEY), {}) || {}
}

function saveAssignments(map) {
    localStorage.setItem(LOCAL_ESCALATION_ASSIGNMENTS_KEY, JSON.stringify(map || {}))
}

function daysOverdue(slaDeadline) {
    if (!slaDeadline) return 0
    const deadline = new Date(slaDeadline)
    const now = new Date()
    const diffMs = now - deadline
    if (diffMs <= 0) return 0
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

function isSlaBreached(complaint) {
    if (!complaint?.slaDeadline) return false
    if (complaint.status === 'RESOLVED') return false
    return new Date(complaint.slaDeadline) < new Date()
}

export default function Escalations() {
    const [loading, setLoading] = useState(true)
    const [complaints, setComplaints] = useState([])
    const [departments, setDepartments] = useState([])
    const [assignments, setAssignments] = useState(() => loadAssignments())

    const refresh = async () => {
        setLoading(true)
        try {
            const [c, d] = await Promise.all([getAllComplaints(), getDepartments()])
            const list = Array.isArray(c) ? c : c?.complaints || []
            setComplaints(Array.isArray(list) ? list : [])
            setDepartments(Array.isArray(d) ? d : [])
        } catch {
            // If backend isn't available, keep the list empty for now
            setComplaints([])
            setDepartments(await getDepartments())
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    const breached = useMemo(() => {
        const list = complaints.filter(isSlaBreached).map((c) => {
            const id = c._id || c.id
            const override = assignments?.[id] || null
            return {
                ...c,
                __id: id,
                __daysOverdue: daysOverdue(c.slaDeadline),
                __assignedDepartmentOverride: override?.departmentId || null,
            }
        })
        list.sort((a, b) => b.__daysOverdue - a.__daysOverdue)
        return list
    }, [complaints, assignments])

    const handleReassign = async (complaintId, departmentId) => {
        const next = { ...(assignments || {}) }
        next[complaintId] = { departmentId, updatedAt: new Date().toISOString() }
        setAssignments(next)
        saveAssignments(next)
        toast({
            variant: 'success',
            title: 'Reassigned',
            description: 'Saved locally (backend integration pending).',
        })
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight flex items-center gap-2">
                        <AlertOctagon className="h-6 w-6 text-red-600" />
                        Escalation Queue
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        SLA-breached complaints sorted by days overdue
                    </p>
                </div>

                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">SLA Breaches</CardTitle>
                        <div className="text-xs text-muted-foreground">
                            {loading ? 'Loading…' : `${breached.length} escalated complaint(s)`}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-zenblue-400" />
                            </div>
                        ) : breached.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <Clock className="h-10 w-10 mx-auto mb-3 text-zenblue-200" />
                                <p>No SLA-breached complaints yet.</p>
                                <p className="text-xs mt-2">
                                    If your backend isn’t connected, the list may be empty.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-zenblue-50/50">
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">ID</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Title</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Priority</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">
                                                Days Overdue
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">
                                                Reassign To
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {breached.map((c) => {
                                            const currentDept =
                                                c.__assignedDepartmentOverride ||
                                                c.aiDepartment ||
                                                c.department ||
                                                ''
                                            return (
                                                <tr
                                                    key={c.__id}
                                                    className="border-b last:border-0 hover:bg-zenblue-50/30 transition-colors"
                                                >
                                                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                                                        {c.__id?.slice(-6)?.toUpperCase()}
                                                    </td>
                                                    <td className="py-3 px-4 font-medium text-zenblue-800 max-w-[260px] truncate">
                                                        {c.title || 'Untitled'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge variant={getPriorityVariant(c.priority)}>
                                                            P{c.priority || '?'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge variant={STATUS_VARIANT[c.status] || 'gray'}>
                                                            {STATUS_LABEL[c.status] || c.status || '—'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge variant={c.__daysOverdue >= 7 ? 'red' : 'orange'}>
                                                            {c.__daysOverdue}d
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2 min-w-[280px]">
                                                            <Select
                                                                value={currentDept}
                                                                onValueChange={(val) => handleReassign(c.__id, val)}
                                                            >
                                                                <SelectTrigger className="w-[220px]">
                                                                    <SelectValue placeholder="Select department" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {departments.map((d) => (
                                                                        <SelectItem key={d.id} value={d.id}>
                                                                            {d.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toast({
                                                                    variant: 'success',
                                                                    title: 'Queued',
                                                                    description: 'One-click reassignment saved locally.',
                                                                })}
                                                                className="text-zenaccent hover:text-zenaccent"
                                                            >
                                                                <ArrowRightLeft className="h-4 w-4 mr-1" />
                                                                Apply
                                                            </Button>
                                                        </div>
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

