import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DepartmentChart({ data = {} }) {
    const chartData = Object.entries(data).map(([department, counts]) => ({
        department,
        total: counts?.total || 0,
        resolved: counts?.resolved || 0,
        pending: counts?.pending || 0,
    }))

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zenblue-800">Department Load</CardTitle>
                <p className="text-xs text-muted-foreground">Total complaints by department</p>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f5fa" />
                            <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip />
                            <Bar dataKey="total" fill="#1e3a5f" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
