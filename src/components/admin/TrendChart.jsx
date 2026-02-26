import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-zenblue-100 rounded-lg p-3 shadow-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-zenaccent" />
                        <span className="text-xs text-muted-foreground">Filed:</span>
                        <span className="text-xs font-semibold text-zenblue-800">{payload[0]?.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs text-muted-foreground">Resolved:</span>
                        <span className="text-xs font-semibold text-zenblue-800">{payload[1]?.value}</span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

export default function TrendChart({ data = [], loading = false }) {
    return (
        <Card className="col-span-1 lg:col-span-2 relative overflow-hidden">
            {loading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-zenblue-600 animate-spin" />
                </div>
            )}
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-zenblue-800">
                            Complaint Trends
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Filed vs. resolved over the last 30 days</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-zenaccent" />
                            <span className="text-xs text-muted-foreground">Filed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs text-muted-foreground">Resolved</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="filedGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f5fa" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={{ stroke: '#e2e8f0' }}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="complaints"
                                stroke="#2563eb"
                                strokeWidth={2}
                                fill="url(#filedGradient)"
                                dot={false}
                                activeDot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="resolved"
                                stroke="#22c55e"
                                strokeWidth={2}
                                fill="url(#resolvedGradient)"
                                dot={false}
                                activeDot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
