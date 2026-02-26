import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Clock, TrendingDown, TrendingUp } from 'lucide-react'

const MOCK_SLA = {
    breached: 12,
    atRisk: 8,
    avgResolutionDays: 3.2,
    avgTrend: -0.4, // negative = improving
}

export default function SLACard() {
    const isImproving = MOCK_SLA.avgTrend < 0

    return (
        <Card className="relative overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-zenblue-800">SLA Overview</h3>
                    <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Breached */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-sm text-muted-foreground">SLA Breached</span>
                        </div>
                        <span className="text-lg font-bold text-red-600">{MOCK_SLA.breached}</span>
                    </div>

                    {/* At Risk */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-sm text-muted-foreground">At Risk</span>
                        </div>
                        <span className="text-lg font-bold text-amber-600">{MOCK_SLA.atRisk}</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-zenblue-50" />

                    {/* Avg Resolution */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Avg. Resolution</span>
                            </div>
                            <span className="text-lg font-bold text-zenblue-800">
                                {MOCK_SLA.avgResolutionDays}d
                            </span>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                            {isImproving ? (
                                <TrendingDown className="h-3 w-3 text-green-600" />
                            ) : (
                                <TrendingUp className="h-3 w-3 text-red-600" />
                            )}
                            <span
                                className={`text-xs font-medium ${isImproving ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {Math.abs(MOCK_SLA.avgTrend)}d {isImproving ? 'improvement' : 'slower'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-green-500" />
            </CardContent>
        </Card>
    )
}
