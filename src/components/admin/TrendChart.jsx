import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MOCK_DATA = [
    { date: 'Feb 01', complaints: 12, resolved: 8 },
    { date: 'Feb 03', complaints: 18, resolved: 10 },
    { date: 'Feb 05', complaints: 9, resolved: 12 },
    { date: 'Feb 07', complaints: 22, resolved: 14 },
    { date: 'Feb 09', complaints: 15, resolved: 11 },
    { date: 'Feb 11', complaints: 28, resolved: 18 },
    { date: 'Feb 13', complaints: 20, resolved: 16 },
    { date: 'Feb 15', complaints: 14, resolved: 19 },
    { date: 'Feb 17', complaints: 25, resolved: 15 },
    { date: 'Feb 19', complaints: 17, resolved: 20 },
    { date: 'Feb 21', complaints: 30, resolved: 22 },
    { date: 'Feb 23', complaints: 19, resolved: 24 },
    { date: 'Feb 25', complaints: 23, resolved: 18 },
    { date: 'Feb 26', complaints: 16, resolved: 21 },
]

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

export default function TrendChart() {
    return (
        <Card className="col-span-1 lg:col-span-2">
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
                        <AreaChart data={MOCK_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
