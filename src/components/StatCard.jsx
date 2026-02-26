import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function StatCard({ title, value, icon: Icon, trend, className }) {
    return (
        <Card className={cn('relative overflow-hidden group', className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight text-zenblue-800">
                            {value}
                        </p>
                        {trend && (
                            <p className="text-xs text-muted-foreground mt-1">{trend}</p>
                        )}
                    </div>
                    {Icon && (
                        <div className="h-12 w-12 rounded-lg bg-zenblue-50 flex items-center justify-center group-hover:bg-zenblue-100 transition-colors">
                            <Icon className="h-6 w-6 text-zenblue-600" />
                        </div>
                    )}
                </div>
                {/* Decorative accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-zenblue-600 to-zenaccent opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
        </Card>
    )
}
