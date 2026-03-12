import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type Sale = {
  id: string;
  customerName: string;
  customerEmail: string;
  avatar: string;
  amount: number;
}

export function RecentSales({ sales }: { sales: Sale[] }) {
  return (
    <div className="space-y-8">
      {sales.map(sale => (
          <div key={sale.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={sale.avatar} alt="Avatar" />
              <AvatarFallback>{sale.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{sale.customerName}</p>
              <p className="text-sm text-muted-foreground">
                {sale.customerEmail}
              </p>
            </div>
            <div className="ml-auto font-medium">+${sale.amount.toFixed(2)}</div>
          </div>
      ))}
    </div>
  )
}
