import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getComplaintById } from '@/api/complaintsApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { Loader2, ArrowLeft, MapPin, Calendar, Building2, AlertCircle } from 'lucide-react'
import { STATUS_VARIANT, STATUS_LABEL, getPriorityVariant } from '@/components/ComplaintCard'

export default function CitizenComplaintDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [complaint, setComplaint] = useState(null)

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const data = await getComplaintById(id)
                setComplaint(data?.complaint || data)
            } catch {
                setComplaint(null)
            } finally {
                setLoading(false)
            }
        }

        fetchComplaint()
    }, [id])

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
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <AlertCircle className="h-12 w-12 mx-auto text-zenblue-200 mb-4" />
                        <h2 className="text-xl font-semibold text-zenblue-800 mb-2">Complaint Not Found</h2>
                        <Button onClick={() => navigate('/citizen/complaints')} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />Back to My Complaints
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" size="sm" onClick={() => navigate('/citizen/complaints')} className="mb-4 text-muted-foreground hover:text-zenblue-700 -ml-2">
                    <ArrowLeft className="h-4 w-4 mr-1" />Back to My Complaints
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-zenblue-800">{complaint.title || 'Complaint Details'}</CardTitle>
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant={STATUS_VARIANT[complaint.status] || 'gray'}>{STATUS_LABEL[complaint.status] || complaint.status}</Badge>
                            {complaint.priority && <Badge variant={getPriorityVariant(complaint.priority)}>Priority {complaint.priority}</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {complaint.imageUrl && (
                            <img src={complaint.imageUrl} alt="Complaint" className="w-full max-h-96 object-cover rounded-lg border" />
                        )}

                        <div>
                            <p className="text-sm text-muted-foreground">Description</p>
                            <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{complaint.description || '—'}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-zenblue-400" />
                                <span>{complaint.address || complaint.location || 'Location unavailable'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-zenblue-400" />
                                <span>{complaint.department || 'Department pending'}</span>
                            </div>
                            {complaint.createdAt && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-zenblue-400" />
                                    <span>{new Date(complaint.createdAt).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
