import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-zenblue-100 rounded-lg p-3 shadow-lg">
                <p className="text-sm font-semibold text-zenblue-800 mb-1.5">{label}</p>
                <div className="space-y-1">
                    {payload.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="text-xs text-muted-foreground capitalize">{item.name}:</span>
                            <span className="text-xs font-semibold text-zenblue-800">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return null
}

export default function DepartmentChart({ data = [], loading = false }) {
    return (
        <Card className="relative overflow-hidden">
            {loading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-zenblue-600 animate-spin" />
                </div>
            )}
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-zenblue-800">
                            Department Workload
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Complaint distribution by department</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-red-400" />
                            <span className="text-[10px] text-muted-foreground">Open</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-amber-400" />
                            <span className="text-[10px] text-muted-foreground">In Progress</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-[10px] text-muted-foreground">Resolved</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data.length > 0 ? data : []}
                            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f5fa" vertical={false} />
                            <XAxis
                                dataKey="department"
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={{ stroke: '#e2e8f0' }}
                                interval={0}
                                angle={-15}
                                textAnchor="end"
                                height={50}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f5fa' }} />
                            <Bar dataKey="open" fill="#f87171" stackId="stack" radius={[0, 0, 0, 0]} barSize={28} />
                            <Bar dataKey="inProgress" fill="#fbbf24" stackId="stack" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="resolved" fill="#22c55e" stackId="stack" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
