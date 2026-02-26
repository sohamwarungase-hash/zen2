import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MOCK_DATA = [
    { name: 'Submitted', value: 42, color: '#3b82f6' },
    { name: 'Assigned', value: 18, color: '#8b5cf6' },
    { name: 'In Progress', value: 35, color: '#f59e0b' },
    { name: 'Resolved', value: 51, color: '#22c55e' },
    { name: 'Escalated', value: 8, color: '#ef4444' },
]

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-zenblue-100 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                    <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: payload[0].payload.color }}
                    />
                    <p className="text-sm font-semibold text-zenblue-800">{payload[0].name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-zenblue-600">{payload[0].value}</span> complaints
                </p>
            </div>
        )
    }
    return null
}

const CustomLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
        {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
                <div
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">{entry.value}</span>
            </div>
        ))}
    </div>
)

export default function StatusPieChart() {
    const total = MOCK_DATA.reduce((sum, d) => sum + d.value, 0)

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zenblue-800">
                    Status Distribution
                </CardTitle>
                <p className="text-xs text-muted-foreground">Current complaint pipeline</p>
            </CardHeader>
            <CardContent>
                <div className="h-[280px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={MOCK_DATA}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                            >
                                {MOCK_DATA.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center text */}
                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-2xl font-bold text-zenblue-800">{total}</p>
                        <p className="text-[10px] text-muted-foreground">Total</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
