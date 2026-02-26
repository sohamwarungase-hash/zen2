import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SLACard({ complaints = [] }) {
    const active = complaints.filter((c) => c.status !== 'RESOLVED' && c.slaDeadline)
    const breached = active.filter((c) => new Date(c.slaDeadline) < new Date()).length
    const atRisk = active.filter((c) => {
        const diff = new Date(c.slaDeadline) - new Date()
        return diff > 0 && diff <= 24 * 60 * 60 * 1000
    }).length

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zenblue-800">SLA Monitor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <p className="text-xs text-muted-foreground">Breached</p>
                    <p className="text-2xl font-bold text-red-600">{breached}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">At Risk (&lt;24h)</p>
                    <p className="text-2xl font-bold text-amber-600">{atRisk}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Tracked</p>
                    <p className="text-lg font-semibold text-zenblue-800">{active.length}</p>
                </div>
            </CardContent>
        </Card>
    )
}
