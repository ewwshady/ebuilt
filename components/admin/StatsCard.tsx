import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface StatsCardProps {
  label: string
  value: string | number
  icon?: string
  href?: string
}

export function StatsCard({ label, value, icon = "📊", href }: StatsCardProps) {
  const content = (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <span className="text-4xl">{icon}</span>
        </div>
        {href && (
          <div className="mt-4 flex items-center gap-1 text-blue-600 text-xs font-medium">
            View details
            <ArrowRight className="h-3 w-3" />
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
