import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function toChartData(trendsMap = {}) {
    const byDate = {}
    Object.entries(trendsMap).forEach(([key, value]) => {
        const [date] = key.split('__')
        byDate[date] = (byDate[date] || 0) + value
    })

    return Object.entries(byDate)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, count]) => ({ date: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), count }))
}

export default function TrendChart({ data = {} }) {
    const chartData = toChartData(data)

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zenblue-800">30-Day Trend</CardTitle>
                <p className="text-xs text-muted-foreground">Daily complaints created</p>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f5fa" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
