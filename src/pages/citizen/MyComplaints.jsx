import { useEffect, useState } from 'react'
import { getMyComplaints } from '@/api/complaintsApi'
import ComplaintCard from '@/components/ComplaintCard'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, FileText, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await getMyComplaints()
                setComplaints(Array.isArray(data) ? data : data?.complaints || [])
            } catch {
                setComplaints([])
            } finally {
                setLoading(false)
            }
        }
        fetchComplaints()
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight">
                            My Complaints
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Track all your filed complaints and their resolution status
                        </p>
                    </div>
                    <Link to="/citizen/report">
                        <Button className="bg-zenblue-800 hover:bg-zenblue-700">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                            All Complaints ({loading ? '...' : complaints.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-zenblue-400" />
                            </div>
                        ) : complaints.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto text-zenblue-200 mb-3" />
                                <p className="text-muted-foreground mb-4">
                                    You haven't filed any complaints yet.
                                </p>
                                <Link to="/citizen/report">
                                    <Button variant="zenblue" size="sm">
                                        <PlusCircle className="h-4 w-4 mr-1" /> Report an Issue
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {complaints.map((complaint) => (
                                    <ComplaintCard
                                        key={complaint._id || complaint.id}
                                        complaint={complaint}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
