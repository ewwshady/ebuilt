import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormCard({ title, description, children, className = "" }: FormCardProps) {
  return (
    <Card className={`shadow-sm border-gray-200 ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
