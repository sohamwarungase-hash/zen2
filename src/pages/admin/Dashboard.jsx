import { useEffect, useMemo, useState } from 'react'
import StatCard from '@/components/StatCard'
import CategoryChart from '@/components/admin/CategoryChart'
import StatusPieChart from '@/components/admin/StatusPieChart'
import TrendChart from '@/components/admin/TrendChart'
import SLACard from '@/components/admin/SLACard'
import ActivityFeed from '@/components/admin/ActivityFeed'
import DepartmentChart from '@/components/admin/DepartmentChart'
import Navbar from '@/components/Navbar'
import { getAnalyticsOverview, getAnalyticsDepartments, getAnalyticsTrends } from '@/api/analyticsApi'
import { getAllComplaints } from '@/api/complaintsApi'
import { FileText, AlertCircle, Clock, CheckCircle, Loader2 } from 'lucide-react'

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [overview, setOverview] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, escalated: 0 })
    const [complaints, setComplaints] = useState([])
    const [departments, setDepartments] = useState({})
    const [trends, setTrends] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overviewData, complaintsData, departmentsData, trendsData] = await Promise.all([
                    getAnalyticsOverview(),
                    getAllComplaints(),
                    getAnalyticsDepartments(),
                    getAnalyticsTrends(),
                ])
                setOverview(overviewData || {})
                setComplaints(Array.isArray(complaintsData) ? complaintsData : complaintsData?.complaints || [])
                setDepartments(departmentsData || {})
                setTrends(trendsData || {})
            } catch {
                setOverview({ total: 0, open: 0, inProgress: 0, resolved: 0, escalated: 0 })
                setComplaints([])
                setDepartments({})
                setTrends({})
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const categoryData = useMemo(() => {
        const map = {}
        complaints.forEach((c) => {
            const key = c.category || 'OTHER'
            map[key] = (map[key] || 0) + 1
        })
        return Object.entries(map)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8)
    }, [complaints])

    const statusData = useMemo(() => {
        const map = { SUBMITTED: 0, ASSIGNED: 0, IN_PROGRESS: 0, RESOLVED: 0, ESCALATED: 0 }
        complaints.forEach((c) => {
            if (map[c.status] !== undefined) map[c.status] += 1
        })
        return map
    }, [complaints])

    const activityData = useMemo(() => {
        return complaints
            .slice()
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
            .slice(0, 8)
            .map((c) => ({
                id: c.id,
                complaintId: `#${String(c.id).slice(-6).toUpperCase()}`,
                title: c.title,
                status: c.status,
                user: c?.user?.name || 'System',
                timestamp: new Date(c.updatedAt || c.createdAt),
            }))
    }, [complaints])

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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight">Admin Dashboard</h1>
                            <p className="text-sm text-muted-foreground mt-1">Real-time overview of grievance operations and system performance</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Complaints" value={overview.total ?? 0} icon={FileText} trend="Live" />
                    <StatCard title="Open" value={overview.open ?? 0} icon={AlertCircle} trend="Submitted" />
                    <StatCard title="In Progress" value={overview.inProgress ?? 0} icon={Clock} trend="Being processed" />
                    <StatCard title="Resolved" value={overview.resolved ?? 0} icon={CheckCircle} trend="Closed" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                    <div className="lg:col-span-2">
                        <CategoryChart data={categoryData} />
                    </div>
                    <StatusPieChart data={statusData} />
                    <SLACard complaints={complaints} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div className="lg:col-span-2">
                        <TrendChart data={trends} />
                    </div>
                    <DepartmentChart data={departments} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <ActivityFeed activities={activityData} />
                </div>
            </main>
        </div>
    )
}
