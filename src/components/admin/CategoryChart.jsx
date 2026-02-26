import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#1e3a5f', '#2563eb', '#407fb4', '#6699c3', '#8db2d2', '#b3cce1']

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-zenblue-100 rounded-lg p-3 shadow-lg">
                <p className="text-sm font-semibold text-zenblue-800">{payload[0].payload.category}</p>
                <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-zenblue-600">{payload[0].value}</span> complaints
                </p>
            </div>
        )
    }
    return null
}

export default function CategoryChart({ data = [] }) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-zenblue-800">Complaints by Category</CardTitle>
                <p className="text-xs text-muted-foreground">Distribution across service categories</p>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f5fa" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={130} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f5fa' }} />
                            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                                {data.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
