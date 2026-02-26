import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import { getMyComplaints } from '@/api/complaintsApi'
import StatCard from '@/components/StatCard'
import ComplaintCard from '@/components/ComplaintCard'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Star, PlusCircle, Loader2, ArrowRight } from 'lucide-react'

export default function Home() {
    const { user } = useAuthStore()
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMyComplaints()
                setComplaints(Array.isArray(data) ? data : data?.complaints || [])
            } catch {
                setComplaints([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const totalComplaints = complaints.length
    const resolvedComplaints = complaints.filter((c) => c.status === 'RESOLVED').length
    const points = user?.points || resolvedComplaints * 10 // Fallback points calculation
    const recentComplaints = complaints.slice(0, 3)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight">
                                Welcome back, {user?.name || 'Citizen'}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Track your complaints and report new civic issues
                            </p>
                        </div>
                        <Link to="/citizen/report">
                            <Button className="bg-zenblue-800 hover:bg-zenblue-700 hidden sm:flex">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Report Issue
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Complaints"
                        value={loading ? '...' : totalComplaints}
                        icon={FileText}
                    />
                    <StatCard
                        title="Resolved"
                        value={loading ? '...' : resolvedComplaints}
                        icon={CheckCircle}
                    />
                    <StatCard
                        title="Civic Points"
                        value={loading ? '...' : points}
                        icon={Star}
                        trend="Earn points for resolved issues"
                    />
                </div>

                {/* Recent Complaints */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-lg">Recent Complaints</CardTitle>
                        <Link to="/citizen/complaints">
                            <Button variant="ghost" size="sm" className="text-zenaccent">
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-zenblue-400" />
                            </div>
                        ) : recentComplaints.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-10 w-10 mx-auto text-zenblue-200 mb-3" />
                                <p className="text-muted-foreground text-sm">No complaints yet.</p>
                                <Link to="/citizen/report">
                                    <Button variant="zenblue" size="sm" className="mt-3">
                                        <PlusCircle className="h-4 w-4 mr-1" /> File Your First Complaint
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentComplaints.map((complaint) => (
                                    <ComplaintCard key={complaint._id || complaint.id} complaint={complaint} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Mobile Report Button */}
                <div className="sm:hidden fixed bottom-6 right-6">
                    <Link to="/citizen/report">
                        <Button className="h-14 w-14 rounded-full bg-zenblue-800 hover:bg-zenblue-700 shadow-lg">
                            <PlusCircle className="h-6 w-6" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}
