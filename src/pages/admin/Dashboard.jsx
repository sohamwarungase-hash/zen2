import { useState } from 'react'
import StatCard from '@/components/StatCard'
import CategoryChart from '@/components/admin/CategoryChart'
import StatusPieChart from '@/components/admin/StatusPieChart'
import TrendChart from '@/components/admin/TrendChart'
import SLACard from '@/components/admin/SLACard'
import ActivityFeed from '@/components/admin/ActivityFeed'
import DepartmentChart from '@/components/admin/DepartmentChart'
import Navbar from '@/components/Navbar'
import {
    FileText,
    AlertCircle,
    Clock,
    CheckCircle,
    TrendingUp,
    BarChart3,
} from 'lucide-react'

const STATS = {
    total: 154,
    open: 42,
    inProgress: 35,
    resolved: 65,
    escalated: 12,
    avgResolution: '3.2 days',
}

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Real-time overview of grievance operations and system performance
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-zenblue-50 text-zenblue-700 px-3 py-1.5 rounded-full">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium">System Active</span>
                        </div>
                    </div>
                </div>

                {/* Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Complaints"
                        value={STATS.total}
                        icon={FileText}
                        trend="+12 this week"
                    />
                    <StatCard
                        title="Open"
                        value={STATS.open}
                        icon={AlertCircle}
                        trend="Awaiting assignment"
                    />
                    <StatCard
                        title="In Progress"
                        value={STATS.inProgress}
                        icon={Clock}
                        trend="Being processed"
                    />
                    <StatCard
                        title="Resolved"
                        value={STATS.resolved}
                        icon={CheckCircle}
                        trend="42% resolution rate"
                    />
                </div>

                {/* Charts Row 1: Category + Status Pie + SLA */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                    <div className="lg:col-span-2">
                        <CategoryChart />
                    </div>
                    <StatusPieChart />
                    <SLACard />
                </div>

                {/* Charts Row 2: Trends + Department */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div className="lg:col-span-2">
                        <TrendChart />
                    </div>
                    <DepartmentChart />
                </div>

                {/* Activity Feed */}
                <div className="grid grid-cols-1 gap-4">
                    <ActivityFeed />
                </div>
            </main>
        </div>
    )
}
