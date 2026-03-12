"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Tenant } from "@/lib/schemas"

interface TenantTableProps {
  tenants: Tenant[]
  onEdit: (tenant: Tenant) => void
  onDelete: (tenantId: string) => void
}

export function TenantTable({ tenants, onEdit, onDelete }: TenantTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subdomain</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No tenants found
              </TableCell>
            </TableRow>
          ) : (
            tenants.map((tenant) => (
              <TableRow key={tenant._id?.toString()}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{tenant.subdomain}</code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tenant.plan}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={tenant.status === "active" ? "default" : "secondary"}>{tenant.status}</Badge>
                </TableCell>
                <TableCell>{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(tenant)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(tenant._id!.toString())} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
